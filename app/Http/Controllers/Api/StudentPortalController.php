<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FileAttachment;
use App\Models\PortalNotification;
use App\Models\StudentCertification;
use App\Models\StudentCourseProgress;
use App\Models\StudentProfile;
use App\Models\User;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StudentPortalController extends Controller
{
    public function verifyCertificate(string $certificate)
    {
        $record = StudentCertification::with('studentProfile.user')
            ->where('certification_number', $certificate)
            ->firstOrFail();

        return response()->json([
            'id' => $record->certification_number,
            'databaseId' => $record->id,
            'studentName' => $record->studentProfile?->user?->name ?: 'Student',
            'courseName' => $record->certification_name,
            'issueDate' => optional($record->issued_date)->toDateString(),
            'issuer' => $record->issuing_organization,
            'certificateUrl' => $record->certificate_url,
            'status' => $record->status === 'active' ? 'Approved' : ucfirst($record->status),
        ]);
    }

    public function verifyBadge(string $badge)
    {
        return $this->verifyPublicCredential($badge, 'badge');
    }

    public function verifyAttestation(string $attestation)
    {
        return $this->verifyPublicCredential($attestation, 'attestation');
    }

    public function dashboard(Request $request)
    {
        $profile = $this->profile($request);
        $courses = $profile
            ? StudentCourseProgress::where('student_id', $profile->id)->latest('last_accessed_at')->get()
            : collect();
        $certificates = $profile
            ? StudentCertification::where('student_id', $profile->id)->latest('issued_date')->get()
            : collect();
        $notifications = PortalNotification::where('user_id', $request->user()->id)->latest()->limit(20)->get();
        $worksheets = FileAttachment::where(function ($query) use ($request) {
            $query->where('uploaded_by_user_id', $request->user()->id)
                ->orWhere(function ($studentQuery) use ($request) {
                    $studentQuery->where('related_model_type', User::class)
                        ->where('related_model_id', $request->user()->id);
                })
                ->orWhere('is_public', true);
        })->where('file_type', 'worksheet')->latest()->get();

        return response()->json([
            'profile' => $profile,
            'courses' => $courses->map(fn ($course) => $this->courseResource($course))->values(),
            'certificates' => $certificates->map(fn ($certificate) => $this->certificateResource($certificate))->values(),
            'worksheets' => $worksheets->map(fn ($file) => $this->fileResource($file))->values(),
            'announcements' => $notifications->map(fn ($notification) => $this->notificationResource($notification))->values(),
            'stats' => [
                'activeCourses' => $courses->whereIn('status', ['enrolled', 'in-progress'])->count(),
                'completedCourses' => $courses->where('status', 'completed')->count(),
                'certificates' => $certificates->count(),
                'attestations' => $certificates->where('status', 'active')->count(),
            ],
        ]);
    }

    public function enroll(Request $request)
    {
        $data = $request->validate([
            'courseId' => ['required', 'string', 'max:100'],
            'courseName' => ['required', 'string', 'max:255'],
            'totalLessons' => ['nullable', 'integer', 'min:0'],
        ]);

        $profile = $this->profile($request, true);

        $course = StudentCourseProgress::firstOrCreate(
            ['student_id' => $profile->id, 'course_id' => $data['courseId']],
            [
                'course_name' => $data['courseName'],
                'progress_percentage' => 0,
                'total_lessons' => $data['totalLessons'] ?? 0,
                'lessons_completed' => 0,
                'total_hours' => 0,
                'hours_completed' => 0,
                'enrollment_date' => now()->toDateString(),
                'status' => 'enrolled',
                'last_accessed_at' => now(),
            ]
        );

        return response()->json($this->courseResource($course->fresh()), 201);
    }

    public function updateProgress(Request $request, StudentCourseProgress $course)
    {
        $profile = $this->profile($request, true);
        abort_unless((int) $course->student_id === (int) $profile->id, 403);

        $data = $request->validate([
            'progress' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $course->update([
            'progress_percentage' => $data['progress'],
            'lessons_completed' => $course->total_lessons > 0
                ? (int) round(($course->total_lessons * $data['progress']) / 100)
                : $course->lessons_completed,
            'status' => 'in-progress',
            'completion_date' => null,
            'last_accessed_at' => now(),
        ]);

        if ($data['progress'] >= 100) {
            $admin = User::where('role', 'admin')->orderBy('id')->first();
            if ($admin) {
                PortalNotification::create([
                    'user_id' => $admin->id,
                    'notification_type' => 'achievement',
                    'title' => 'Course completion awaiting approval',
                    'description' => $request->user()->name . ' completed ' . $course->course_name . '. Review and approve certificate issuance.',
                    'related_data' => ['course_progress_id' => $course->id],
                ]);
            }
        }

        return response()->json([
            'course' => $this->courseResource($course->fresh()),
            'certificate' => null,
            'message' => $data['progress'] >= 100 ? 'Completion submitted for admin approval.' : 'Progress updated.',
        ]);
    }

    public function sendSupportMessage(Request $request)
    {
        $data = $request->validate([
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
            'attachment' => ['nullable', 'file', 'max:10240'],
        ]);
        abort_if(empty($data['message']) && ! $request->hasFile('attachment'), 422, 'Message or attachment is required.');

        $admin = User::where('role', 'admin')->orderBy('id')->first();
        abort_unless($admin, 422, 'No admin recipient is configured.');

        $message = UserMessage::create([
            'sender_user_id' => $request->user()->id,
            'receiver_user_id' => $admin->id,
            'subject' => $data['subject'] ?? 'Student support request',
            'message' => $data['message'] ?? '',
        ]);

        $this->attachMessageFile($request, $message);

        return response()->json($this->messageResource($message), 201);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'linkedinUrl' => ['nullable', 'url', 'max:255'],
            'portfolioUrl' => ['nullable', 'url', 'max:255'],
        ]);

        $request->user()->update([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? $request->user()->phone,
        ]);

        $profile = $this->profile($request, true);
        $profile->update([
            'bio' => $data['bio'] ?? null,
            'linkedin_url' => $data['linkedinUrl'] ?? null,
            'portfolio_url' => $data['portfolioUrl'] ?? null,
        ]);

        return response()->json($profile->fresh());
    }

    protected function profile(Request $request, bool $create = false): ?StudentProfile
    {
        $query = StudentProfile::where('user_id', $request->user()->id);

        if (! $create) {
            return $query->first();
        }

        return $query->firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'student_id' => 'ST-' . str_pad((string) $request->user()->id, 6, '0', STR_PAD_LEFT),
                'status' => 'active',
            ]
        );
    }

    protected function courseResource(StudentCourseProgress $course): array
    {
        return [
            'id' => $course->id,
            'courseId' => $course->course_id,
            'courseName' => $course->course_name,
            'progress' => $course->progress_percentage,
            'totalLessons' => $course->total_lessons,
            'lessonsCompleted' => $course->lessons_completed,
            'status' => $course->status,
            'enrollmentDate' => optional($course->enrollment_date)->toDateString(),
            'completionDate' => optional($course->completion_date)->toDateString(),
        ];
    }

    protected function certificateResource(StudentCertification $certificate): array
    {
        return [
            'id' => $certificate->certification_number,
            'databaseId' => $certificate->id,
            'courseName' => $certificate->certification_name,
            'issueDate' => optional($certificate->issued_date)->toDateString(),
            'issuer' => $certificate->issuing_organization,
            'certificateUrl' => $certificate->certificate_url,
            'status' => $certificate->status === 'active' ? 'Approved' : ucfirst($certificate->status),
        ];
    }

    protected function fileResource(FileAttachment $file): array
    {
        return [
            'id' => $file->id,
            'name' => $file->file_name,
            'url' => $this->publishedFileUrl($file->file_path),
            'size' => $file->file_size,
            'type' => $file->file_type,
            'createdAt' => optional($file->created_at)->toISOString(),
        ];
    }

    protected function publishPublicDiskFile(string $path): string
    {
        $normalized = str_replace('\\', '/', ltrim($path, '/'));
        $source = Storage::disk('public')->path($normalized);
        $target = public_path('storage/' . $normalized);

        if (is_file($source) && ! is_file($target)) {
            $directory = dirname($target);
            if (! is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            copy($source, $target);
        }

        return url('storage/' . $normalized);
    }

    protected function publishedFileUrl(?string $filePath): string
    {
        if (! $filePath) {
            return '';
        }

        $path = parse_url($filePath, PHP_URL_PATH) ?: $filePath;
        if (str_contains($path, '/storage/')) {
            $relative = Str::after($path, '/storage/');
            return $this->publishPublicDiskFile($relative);
        }

        return Str::startsWith($filePath, ['http://', 'https://']) ? $filePath : url($filePath);
    }

    protected function notificationResource(PortalNotification $notification): array
    {
        return [
            'id' => $notification->id,
            'title' => $notification->title,
            'description' => $notification->description,
            'type' => $notification->notification_type,
            'isRead' => $notification->is_read,
            'createdAt' => optional($notification->created_at)->toISOString(),
        ];
    }

    protected function messageResource(UserMessage $message): array
    {
        return [
            'id' => $message->id,
            'subject' => $message->subject,
            'message' => $message->message,
            'createdAt' => optional($message->created_at)->toISOString(),
        ];
    }

    protected function verifyPublicCredential(string $id, string $type)
    {
        $groups = $type === 'badge'
            ? ['admin_module_certifications', 'admin_module_academy-content']
            : ['admin_module_certifications', 'admin_module_cms'];

        $rows = DB::table('system_settings')
            ->whereIn('group', $groups)
            ->latest()
            ->limit(500)
            ->get();

        foreach ($rows as $row) {
            $payload = json_decode($row->setting_value, true);
            if (! is_array($payload)) {
                continue;
            }

            $candidateIds = array_filter([
                $payload['id'] ?? null,
                $payload['badgeId'] ?? null,
                $payload['attestationId'] ?? null,
                $payload['certificateId'] ?? null,
                $payload['amount'] ?? null,
            ]);

            if (! in_array($id, $candidateIds, true)) {
                continue;
            }

            return response()->json([
                'id' => $id,
                'type' => $type,
                'studentName' => $payload['studentName'] ?? $payload['owner'] ?? 'Student',
                'courseName' => $payload['courseName'] ?? $payload['title'] ?? 'Digital Solutions Hub Credential',
                'issueDate' => $payload['issuedDate'] ?? $payload['issueDate'] ?? $row->created_at,
                'issuer' => $payload['issuer'] ?? 'Digital Solutions Hub',
                'status' => $payload['status'] ?? 'verified',
                'payload' => $payload,
            ]);
        }

        return response()->json([
            'message' => Str::headline($type) . ' record was not found.',
        ], 404);
    }

    protected function attachMessageFile(Request $request, UserMessage $message): void
    {
        if (! $request->hasFile('attachment')) {
            return;
        }

        $uploaded = $request->file('attachment');
        $path = $uploaded->store('message-attachments', 'public');
        $publicUrl = $this->publishPublicDiskFile($path);

        FileAttachment::create([
            'uploaded_by_user_id' => $request->user()->id,
            'file_name' => $uploaded->getClientOriginalName(),
            'file_path' => $publicUrl,
            'file_size' => $uploaded->getSize(),
            'file_type' => 'message-attachment',
            'mime_type' => $uploaded->getMimeType() ?: 'application/octet-stream',
            'related_model_type' => UserMessage::class,
            'related_model_id' => $message->id,
            'description' => 'Message attachment',
        ]);

        $message->update([
            'message' => trim($message->message . "\n\nAttachment: " . $publicUrl),
        ]);
    }
}
