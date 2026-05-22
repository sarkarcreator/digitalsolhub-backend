<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentPreRegistration;
use App\Services\NotificationService;
use Illuminate\Http\Request;
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
