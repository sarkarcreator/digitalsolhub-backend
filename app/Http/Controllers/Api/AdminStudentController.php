<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentPreRegistration;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AdminStudentController extends Controller
{
    public function __construct(protected NotificationService $notifications)
    {
    }

    public function index()
    {
        $this->ensureAdmin(request());

        return StudentPreRegistration::query()
            ->latest()
            ->get()
            ->map(fn (StudentPreRegistration $student) => [
                'id' => $student->id,
                'name' => $student->full_name,
                'email' => $student->email,
                'phone' => $student->phone,
                'studentId' => $student->student_id,
                'course' => $student->course_name,
                'status' => $student->status,
                'createdAt' => optional($student->created_at)->toISOString(),
            ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'email' => ['required', 'email', 'max:190', 'unique:student_pre_registrations,email'],
            'phone' => ['required', 'string', 'max:30'],
            'course' => ['required', 'string', 'max:190'],
        ]);

        $student = StudentPreRegistration::create([
            'student_id' => $this->generateStudentId(),
            'full_name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'course_name' => $data['course'],
            'status' => 'invited',
            'invited_by_user_id' => $request->user()?->id,
            'invited_at' => now(),
        ]);

        $this->notifications->send(
            $student->email,
            'student_invite',
            'Your Student ID for Digital Solutions Hub',
            [
                'name' => $student->full_name,
                'student_id' => $student->student_id,
                'course' => $student->course_name,
            ],
            $request->user()
        );

        return response()->json([
            'id' => $student->id,
            'name' => $student->full_name,
            'email' => $student->email,
            'phone' => $student->phone,
            'studentId' => $student->student_id,
            'course' => $student->course_name,
            'status' => $student->status,
            'createdAt' => optional($student->created_at)->toISOString(),
        ], 201);
    }

    public function update(Request $request, int $student)
    {
        $this->ensureAdmin($request);

        $record = StudentPreRegistration::query()->findOrFail($student);

        $emailRules = [
            'required',
            'email',
            'max:190',
            Rule::unique('student_pre_registrations', 'email')->ignore($record->id),
        ];

        if ($record->registered_user_id) {
            $emailRules[] = Rule::unique('users', 'email')->ignore($record->registered_user_id);
        } else {
            $emailRules[] = Rule::unique('users', 'email');
        }

        // A registered invitation must remain registered; an unregistered
        // invitation cannot be marked registered without a real user account.
        $allowedStatuses = $record->registered_user_id
            ? ['registered', 'disabled']
            : ['invited', 'disabled'];

        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'email' => $emailRules,
            'phone' => ['required', 'string', 'max:30'],
            'course' => ['required', 'string', 'max:190'],
            'status' => ['required', Rule::in($allowedStatuses)],
        ]);

        $record = DB::transaction(function () use ($record, $data) {
            $record->update([
                'full_name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'course_name' => $data['course'],
                'status' => $data['status'],
            ]);

            // Keep the registered student's login and profile consistent
            // with the admin-managed student record.
            if ($record->registered_user_id) {
                $user = User::query()->findOrFail($record->registered_user_id);
                $user->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                ]);

                $user->studentProfile?->update([
                    'course_name' => $data['course'],
                ]);
            }

            return $record->refresh();
        });

        return response()->json([
            'id' => $record->id,
            'name' => $record->full_name,
            'email' => $record->email,
            'phone' => $record->phone,
            'studentId' => $record->student_id,
            'course' => $record->course_name,
            'status' => $record->status,
            'createdAt' => optional($record->created_at)->toISOString(),
        ]);
    }

    public function destroy(Request $request, int $student)
    {
        $this->ensureAdmin($request);

        $record = StudentPreRegistration::query()->findOrFail($student);

        // Do not orphan a registered student's account and learning records.
        if ($record->registered_user_id) {
            return response()->json([
                'message' => 'This student has already registered. Their account cannot be deleted from the invitation list.',
            ], 409);
        }

        $record->delete();

        return response()->noContent();
    }

    protected function generateStudentId(): string
    {
        do {
            $candidate = 'ST'.Str::upper(Str::random(6));
        } while (StudentPreRegistration::where('student_id', $candidate)->exists());

        return $candidate;
    }

    protected function ensureAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            throw ValidationException::withMessages([
                'auth' => ['Only admin users can manage student IDs.'],
            ]);
        }
    }
}
