<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\StudentPreRegistration;
use App\Models\StudentProfile;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(protected NotificationService $notifications)
    {
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['required', Rule::in(['student', 'client', 'admin'])],
        ]);

        $user = User::with('studentProfile', 'clientProfile')->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password) || $user->role !== $data['role'] || ! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->transformUser($user),
            'message' => 'Login successful.',
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'role' => ['required', Rule::in(['student', 'client'])],
            'name' => ['required', 'string', 'max:190'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'student_id' => ['nullable', 'string', 'max:20'],
            'course' => ['nullable', 'string', 'max:190'],
            'industry' => ['nullable', 'string', 'max:190'],
            'project' => ['nullable', 'string', 'max:190'],
            'language' => ['nullable', 'string', 'max:10'],
        ]);

        if (User::where('email', $data['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered.'],
            ]);
        }

        return DB::transaction(function () use ($data) {
            return $data['role'] === 'student'
                ? $this->registerStudent($data)
                : $this->registerClient($data);
        });
    }

    protected function registerStudent(array $data)
    {
        $invitation = StudentPreRegistration::where('student_id', $data['student_id'] ?? '')
            ->where('email', $data['email'])
            ->where('status', 'invited')
            ->first();

        if (! $invitation) {
            throw ValidationException::withMessages([
                'student_id' => ['Student ID not found or email does not match the admin record.'],
            ]);
        }

        $user = User::create([
            'role' => 'student',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        StudentProfile::create([
            'user_id' => $user->id,
            'student_id' => $invitation->student_id,
            'course_name' => $invitation->course_name,
        ]);

        $invitation->update([
            'status' => 'registered',
            'registered_user_id' => $user->id,
            'registered_at' => now(),
        ]);

        $this->notifications->send(
            $user->email,
            'signup_welcome',
            'Thanks for signup with Digital Solutions Hub',
            ['name' => $user->name, 'role' => 'student'],
            $user
        );

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->transformUser($user->fresh('studentProfile')),
            'message' => 'Signup successful.',
        ], 201);
    }

    protected function registerClient(array $data)
    {
        $user = User::create([
            'role' => 'client',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        ClientProfile::create([
            'user_id' => $user->id,
            'industry' => $data['industry'] ?? null,
            'project_type' => $data['project'] ?? null,
            'company_name' => $data['name'],
        ]);

        $this->notifications->send(
            $user->email,
            'signup_welcome',
            'Thanks for signup with Digital Solutions Hub',
            ['name' => $user->name, 'role' => 'client'],
            $user
        );

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $this->transformUser($user->fresh('clientProfile')),
            'message' => 'Signup successful.',
        ], 201);
    }

    public function me(Request $request)
    {
        return response()->json($this->transformUser($request->user()->load('studentProfile', 'clientProfile')));
    }

    public function forgotPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($data);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent. Check your email.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()?->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    protected function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'studentId' => $user->studentProfile?->student_id,
        ];
    }
}
