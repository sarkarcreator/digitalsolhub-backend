<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FileAttachment;
use App\Models\PaymentOrder;
use App\Models\PortalNotification;
use App\Models\ServiceRequest;
use App\Models\StudentCertification;
use App\Models\StudentCourseProgress;
use App\Models\StudentPreRegistration;
use App\Models\User;
use App\Models\UserMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminPortalController extends Controller
{
    protected array $modules = [
        'deck', 'financials', 'franchises', 'crm', 'requests', 'clients', 'courses',
        'certifications', 'payments', 'cms', 'academy-content', 'marketplace', 'jobs', 'service-catalog', 'proposals', 'team', 'reports', 'messages', 'settings',
        'activity-logs', 'api-logs', 'login-attempts', 'analytics', 'system-events',
    ];

    public function overview(Request $request)
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'students' => User::where('role', 'student')->count(),
            'clients' => User::where('role', 'client')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'courses' => StudentCourseProgress::count(),
            'certificates' => StudentCertification::count(),
            'projects' => ServiceRequest::count(),
            'openProjects' => ServiceRequest::where('status', 'open')->count(),
            'invoices' => PaymentOrder::count(),
            'pendingRevenue' => (float) PaymentOrder::whereIn('status', ['pending', 'processing'])->sum('amount'),
            'messages' => UserMessage::count(),
            'notifications' => PortalNotification::count(),
        ]);
    }

    public function index(Request $request, string $module)
    {
        $this->authorizeAdmin($request);
        $this->validateModule($module);

        if ($module === 'clients') {
            return response()->json(User::with('clientProfile')->where('role', 'client')->latest()->get()->map(fn ($user) => [
                'id' => $user->id,
                'status' => $user->is_active ? 'active' : 'disabled',
                'payload' => [
                    'title' => $user->name,
                    'amount' => $user->email,
                    'phone' => $user->phone,
                    'company' => $user->clientProfile?->company_name,
                ],
                'createdAt' => optional($user->created_at)->toISOString(),
            ]));
        }

        if ($module === 'requests') {
            return response()->json(ServiceRequest::latest()->get()->map(fn ($project) => [
                'id' => $project->id,
                'status' => $project->status,
                'payload' => [
                    'title' => $project->project_title,
                    'amount' => $project->budget_currency . ' ' . trim(($project->budget_min ?? '') . ' - ' . ($project->budget_max ?? '')),
                    'budgetMin' => $project->budget_min,
                    'budgetMax' => $project->budget_max,
                    'budgetCurrency' => $project->budget_currency,
                    'owner' => optional(User::find($project->requester_user_id))->name,
                    'category' => $project->required_skills[0] ?? $project->project_type,
                    'projectType' => $project->project_type,
                    'clientId' => $project->requester_user_id,
                    'details' => $project->project_description,
                    'invoiceAmount' => optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->amount,
                    'paymentMethod' => optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->payment_method,
                    'paymentInstructions' => $this->extractPaymentInstructions((string) optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->notes),
                    'paymentLink' => $this->extractInvoiceValue((string) optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->notes, 'Payment link'),
                    'bankAccountDetails' => $this->extractInvoiceSection((string) optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->notes, 'Bank account details'),
                    'progress' => match ($project->status) {
                        'completed' => '100%',
                        'in-progress' => '50%',
                        'assigned' => '25%',
                        default => '0%',
                    },
                    'deadline' => optional($project->deadline)->toDateString(),
                    'files' => FileAttachment::where('related_model_type', ServiceRequest::class)
                        ->where('related_model_id', $project->id)
                        ->latest()
                        ->get()
                        ->map(fn ($file) => $this->fileResource($file))
                        ->values(),
                ],
                'createdAt' => optional($project->created_at)->toISOString(),
            ]));
        }

        if ($module === 'payments') {
            return response()->json(PaymentOrder::latest()->get()->map(fn ($invoice) => [
                'id' => $invoice->id,
                'status' => $invoice->status,
                'payload' => [
                    'title' => $invoice->order_number,
                    'amount' => $invoice->currency . ' ' . number_format((float) $invoice->amount, 2),
                    'owner' => optional(User::find($invoice->user_id))->name,
                    'details' => $invoice->notes,
                    'referenceId' => $invoice->reference_id,
                    'orderType' => $invoice->order_type,
                ],
                'createdAt' => optional($invoice->created_at)->toISOString(),
            ]));
        }

        if ($module === 'messages') {
            return response()->json(UserMessage::latest()->get()->map(fn ($message) => [
                'id' => $message->id,
                'status' => $message->is_read ? 'read' : 'unread',
                'payload' => [
                    'title' => $message->subject,
                    'amount' => Str::limit($message->message, 80),
                    'owner' => optional(User::find($message->sender_user_id))->name,
                    'senderId' => $message->sender_user_id,
                    'receiverId' => $message->receiver_user_id,
                    'senderName' => optional(User::find($message->sender_user_id))->name,
                    'senderEmail' => optional(User::find($message->sender_user_id))->email,
                    'senderRole' => optional(User::find($message->sender_user_id))->role,
                    'receiverName' => optional(User::find($message->receiver_user_id))->name,
                    'details' => $message->message,
                ],
                'createdAt' => optional($message->created_at)->toISOString(),
            ]));
        }

        if ($module === 'reports') {
            $completionRequests = StudentCourseProgress::with('studentProfile.user')
                ->where('progress_percentage', '>=', 100)
                ->where('status', '!=', 'completed')
                ->latest()
                ->get()
                ->map(fn ($course) => [
                    'id' => 'course-' . $course->id,
                    'status' => 'needs-review',
                    'payload' => [
                        'title' => 'Course completion approval needed',
                        'amount' => $course->progress_percentage . '%',
                        'owner' => $course->studentProfile?->user?->name,
                        'details' => $course->course_name . ' is submitted for admin approval before certificate generation.',
                        'sourceModule' => 'courses',
                        'sourceId' => $course->id,
                    ],
                    'createdAt' => optional($course->updated_at)->toISOString(),
                ]);

            $openProjects = ServiceRequest::whereIn('status', ['open', 'assigned', 'in-progress'])
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($project) => [
                    'id' => 'project-' . $project->id,
                    'status' => $project->status,
                    'payload' => [
                        'title' => 'Project follow-up',
                        'amount' => $project->budget_currency . ' ' . $project->budget_min . ' - ' . $project->budget_max,
                        'owner' => optional(User::find($project->requester_user_id))->name,
                        'details' => $project->project_title,
                        'sourceModule' => 'requests',
                        'sourceId' => $project->id,
                    ],
                    'createdAt' => optional($project->updated_at)->toISOString(),
                ]);

            return response()->json($completionRequests->concat($openProjects)->values());
        }

        if (in_array($module, ['activity-logs', 'api-logs', 'login-attempts', 'analytics', 'system-events'], true)) {
            return response()->json($this->operationalLogItems($module));
        }

        if ($module === 'courses') {
            return response()->json(StudentCourseProgress::latest()->get()->map(fn ($course) => [
                'id' => $course->id,
                'status' => $course->status,
                'payload' => [
                    'title' => $course->course_name,
                    'amount' => $course->progress_percentage . '%',
                    'owner' => optional($course->studentProfile?->user)->name,
                    'studentId' => $course->student_id,
                    'studentUserId' => $course->studentProfile?->user?->id,
                    'courseId' => $course->course_id,
                    'completionDate' => optional($course->completion_date)->toDateString(),
                    'files' => FileAttachment::where('file_type', 'worksheet')
                        ->where(function ($query) use ($course) {
                            $query->where('is_public', true)
                                ->orWhere(function ($studentQuery) use ($course) {
                                    $studentQuery->where('related_model_type', User::class)
                                        ->where('related_model_id', $course->studentProfile?->user?->id);
                                });
                        })
                        ->latest()
                        ->get()
                        ->map(fn ($file) => $this->fileResource($file))
                        ->values(),
                ],
                'createdAt' => optional($course->created_at)->toISOString(),
            ]));
        }

        if ($module === 'certifications') {
            return response()->json(StudentCertification::with('studentProfile.user')->latest()->get()->map(fn ($certificate) => [
                'id' => $certificate->id,
                'status' => $certificate->status,
                'payload' => [
                    'title' => $certificate->certification_name,
                    'amount' => $certificate->certification_number,
                    'owner' => $certificate->studentProfile?->user?->name,
                    'studentName' => $certificate->studentProfile?->user?->name,
                    'issuer' => $certificate->issuing_organization,
                    'issuedDate' => optional($certificate->issued_date)->toDateString(),
                ],
                'createdAt' => optional($certificate->created_at)->toISOString(),
            ]));
        }

        if ($module === 'settings') {
            return response()->json(
                DB::table('system_settings')
                    ->orderBy('group')
                    ->orderBy('setting_key')
                    ->get()
                    ->map(fn ($row) => $this->settingResource($row))
            );
        }

        return response()->json(
            DB::table('system_settings')
                ->where('group', $this->groupName($module))
                ->latest()
                ->get()
                ->map(fn ($row) => $this->settingResource($row))
        );
    }

    public function publicIndex(string $module)
    {
        $aliases = [
            'services' => 'service-catalog',
            'tools' => 'cms',
            'courses' => 'academy-content',
        ];

        $module = $aliases[$module] ?? $module;
        $this->validateModule($module);
        abort_unless(in_array($module, ['marketplace', 'jobs', 'service-catalog', 'cms', 'academy-content'], true), 404, 'Unknown public module.');

        return response()->json(
            DB::table('system_settings')
                ->where('group', $this->groupName($module))
                ->latest()
                ->get()
                ->map(fn ($row) => $this->settingResource($row))
                ->filter(fn ($item) => in_array($item['status'] ?? 'active', ['active', 'published'], true))
                ->values()
        );
    }

    public function store(Request $request, string $module)
    {
        $this->authorizeAdmin($request);
        $this->validateModule($module);

        if ($module === 'settings') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'string'],
                'status' => ['nullable', 'string', 'max:80'],
                'group' => ['nullable', 'string', 'max:100'],
            ]);

            $id = DB::table('system_settings')->insertGetId([
                'setting_key' => $data['title'],
                'setting_value' => $data['amount'],
                'setting_type' => 'string',
                'description' => 'Managed from admin settings',
                'is_editable' => true,
                'is_public' => false,
                'group' => $data['group'] ?? 'general',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json($this->settingResource(DB::table('system_settings')->where('id', $id)->first()), 201);
        }

        if ($module === 'payments') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'numeric', 'min:0'],
                'status' => ['required', 'string', 'max:80'],
                'userId' => ['nullable', 'integer'],
                'orderType' => ['nullable', 'string', 'max:40'],
                'notes' => ['nullable', 'string', 'max:4000'],
            ]);

            $userId = $data['userId'] ?? User::whereIn('role', ['client', 'student'])->value('id');
            abort_unless($userId, 422, 'Create a student or client before creating an invoice.');

            $invoice = PaymentOrder::create([
                'order_number' => 'INV-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6)),
                'user_id' => $userId,
                'amount' => $data['amount'],
                'currency' => 'USD',
                'order_type' => $data['orderType'] ?? 'other',
                'status' => $this->paymentStatus($data['status']),
                'notes' => $data['notes'] ?? $data['title'],
            ]);

            return response()->json([
                'id' => $invoice->id,
                'status' => $invoice->status,
                'payload' => [
                    'title' => $invoice->notes ?: $invoice->order_number,
                    'amount' => $invoice->currency . ' ' . number_format((float) $invoice->amount, 2),
                    'owner' => optional(User::find($invoice->user_id))->name,
                    'invoiceNumber' => $invoice->order_number,
                ],
            ], 201);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:80'],
            'details' => ['nullable', 'string', 'max:5000'],
            'group' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:120'],
            'image' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $id = DB::table('system_settings')->insertGetId([
            'setting_key' => 'admin_module_' . $module . '_' . Str::uuid(),
            'setting_value' => json_encode([
                'title' => $data['title'],
                'amount' => $data['amount'] ?? null,
                'status' => $data['status'],
                'owner' => $data['group'] ?? $request->user()->name,
                'group' => $data['group'] ?? null,
                'type' => $data['type'] ?? null,
                'details' => $data['details'] ?? null,
                'image' => $data['image'] ?? null,
                'location' => $data['location'] ?? null,
                'category' => $data['category'] ?? null,
            ]),
            'setting_type' => 'json',
            'description' => 'Admin module record',
            'is_editable' => true,
            'is_public' => false,
            'group' => $this->groupName($module),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $row = DB::table('system_settings')->where('id', $id)->first();

        return response()->json($this->settingResource($row), 201);
    }

    public function update(Request $request, string $module, int $id)
    {
        $this->authorizeAdmin($request);
        $this->validateModule($module);

        if ($module === 'certifications') {
            $data = $request->validate([
                'studentName' => ['nullable', 'string', 'max:255'],
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'string', 'max:100'],
                'status' => ['required', 'string', 'max:80'],
            ]);

            $certificate = StudentCertification::with('studentProfile.user')->findOrFail($id);
            $certificate->update([
                'certification_name' => $data['title'],
                'certification_number' => $data['amount'],
                'status' => $data['status'],
            ]);

            if (! empty($data['studentName']) && $certificate->studentProfile?->user) {
                $certificate->studentProfile->user->update(['name' => $data['studentName']]);
            }

            $certificate->refresh()->load('studentProfile.user');

            return response()->json([
                'id' => $certificate->id,
                'status' => $certificate->status,
                'payload' => [
                    'title' => $certificate->certification_name,
                    'amount' => $certificate->certification_number,
                    'owner' => $certificate->studentProfile?->user?->name,
                    'studentName' => $certificate->studentProfile?->user?->name,
                    'issuer' => $certificate->issuing_organization,
                    'issuedDate' => optional($certificate->issued_date)->toDateString(),
                ],
            ]);
        }

        if ($module === 'courses') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'string', 'max:20'],
                'status' => ['required', 'string', 'max:80'],
            ]);

            $course = StudentCourseProgress::with('studentProfile.user')->findOrFail($id);
            $progress = (int) trim($data['amount'], '% ');
            $course->update([
                'course_name' => $data['title'],
                'progress_percentage' => max(0, min(100, $progress)),
                'status' => $data['status'] === 'completed' ? 'completed' : 'in-progress',
                'completion_date' => $data['status'] === 'completed' ? now()->toDateString() : null,
            ]);

            $certificate = null;
            if ($data['status'] === 'completed') {
                $certificate = StudentCertification::firstOrCreate(
                    ['student_id' => $course->student_id, 'certification_name' => $course->course_name],
                    [
                        'certification_number' => 'DSH-' . Str::upper(Str::random(10)),
                        'issued_date' => now()->toDateString(),
                        'issuing_organization' => 'Digital Solutions Hub',
                        'status' => 'active',
                    ]
                );
            }

            return response()->json([
                'id' => $course->id,
                'status' => $course->status,
                'payload' => [
                    'title' => $course->course_name,
                    'amount' => $course->progress_percentage . '%',
                    'owner' => $course->studentProfile?->user?->name,
                    'certificateId' => $certificate?->certification_number,
                ],
            ]);
        }

        if ($module === 'requests') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['nullable', 'string', 'max:255'],
                'status' => ['required', 'string', 'max:80'],
                'details' => ['nullable', 'string', 'max:10000'],
                'deadline' => ['nullable', 'date'],
                'invoiceAmount' => ['nullable', 'numeric', 'min:0'],
                'paymentMethod' => ['nullable', 'string', 'max:80'],
                'paymentLink' => ['nullable', 'url', 'max:1000'],
                'bankAccountDetails' => ['nullable', 'string', 'max:4000'],
                'paymentInstructions' => ['nullable', 'string', 'max:4000'],
            ]);

            $project = ServiceRequest::findOrFail($id);
            $project->update([
                'project_title' => $data['title'],
                'project_description' => $data['details'] ?? $project->project_description,
                'status' => in_array($data['status'], ['open', 'assigned', 'in-progress', 'completed', 'cancelled'], true) ? $data['status'] : $project->status,
                'deadline' => $data['deadline'] ?? $project->deadline,
            ]);

            $invoiceAmount = isset($data['invoiceAmount'])
                ? (float) $data['invoiceAmount']
                : (float) preg_replace('/[^0-9.]/', '', $data['amount'] ?? '');
            if ($invoiceAmount > 0) {
                $projectScope = trim(preg_replace('/^\s*Preferred payment method:.*$/mi', '', $project->project_description));
                $paymentMethod = $data['paymentMethod'] ?? null;
                $paymentLink = trim((string) ($data['paymentLink'] ?? ''));
                $bankAccountDetails = trim((string) ($data['bankAccountDetails'] ?? ''));
                $paymentInstructions = trim((string) ($data['paymentInstructions'] ?? ''));
                $paymentBlocks = [];
                if ($paymentMethod) {
                    $paymentBlocks[] = 'Payment method: ' . Str::headline(str_replace('-', ' ', $paymentMethod));
                }
                if ($paymentLink) {
                    $paymentBlocks[] = 'Payment link: ' . $paymentLink;
                }
                if ($bankAccountDetails) {
                    $paymentBlocks[] = 'Bank account details:' . "\n" . $bankAccountDetails;
                }
                if ($paymentInstructions) {
                    $paymentBlocks[] = 'Extra instructions:' . "\n" . $paymentInstructions;
                }
                $invoiceNotes = trim(
                    'Project: ' . $project->project_title . "\n\n" .
                    'Scope / client request:' . "\n" . $projectScope . "\n\n" .
                    (! empty($paymentBlocks) ? 'Payment instructions:' . "\n" . implode("\n\n", $paymentBlocks) : '')
                );
                $storedPaymentMethod = match ($paymentMethod) {
                    'bank-transfer' => 'bank-transfer',
                    'crypto' => 'binance',
                    default => null,
                };

                PaymentOrder::updateOrCreate(
                    [
                        'order_type' => 'project',
                        'reference_id' => (string) $project->id,
                    ],
                    [
                        'order_number' => PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->value('order_number')
                            ?: 'INV-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6)),
                        'user_id' => $project->requester_user_id,
                        'amount' => $invoiceAmount,
                        'currency' => 'USD',
                        'status' => 'pending',
                        'payment_method' => $storedPaymentMethod,
                        'notes' => $invoiceNotes,
                    ]
                );

                PortalNotification::create([
                    'user_id' => $project->requester_user_id,
                    'notification_type' => 'payment',
                    'title' => 'Invoice issued',
                    'description' => 'A new invoice for USD ' . number_format($invoiceAmount, 2) . ' has been issued for "' . $project->project_title . '".',
                    'related_data' => ['project_id' => $project->id],
                ]);
            }

            PortalNotification::create([
                'user_id' => $project->requester_user_id,
                'notification_type' => 'application',
                'title' => 'Project updated',
                'description' => 'Your project "' . $project->project_title . '" is now ' . $project->status . '.',
                'related_data' => ['project_id' => $project->id],
            ]);

            return response()->json([
                'id' => $project->id,
                'status' => $project->status,
                'payload' => [
                    'title' => $project->project_title,
                    'amount' => $project->budget_currency . ' ' . $project->budget_min . ' - ' . $project->budget_max,
                    'budgetMin' => $project->budget_min,
                    'budgetMax' => $project->budget_max,
                    'budgetCurrency' => $project->budget_currency,
                    'owner' => optional(User::find($project->requester_user_id))->name,
                    'category' => $project->required_skills[0] ?? $project->project_type,
                    'projectType' => $project->project_type,
                    'clientId' => $project->requester_user_id,
                    'details' => $project->project_description,
                    'invoiceAmount' => $invoiceAmount ?: null,
                    'paymentMethod' => $data['paymentMethod'] ?? optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->payment_method,
                    'paymentLink' => $data['paymentLink'] ?? null,
                    'bankAccountDetails' => $data['bankAccountDetails'] ?? null,
                    'paymentInstructions' => $data['paymentInstructions'] ?? optional(PaymentOrder::where('order_type', 'project')->where('reference_id', (string) $project->id)->latest()->first())->notes,
                    'deadline' => optional($project->deadline)->toDateString(),
                ],
            ]);
        }

        if ($module === 'messages') {
            $data = $request->validate([
                'details' => ['required', 'string', 'max:5000'],
                'title' => ['nullable', 'string', 'max:255'],
                'status' => ['nullable', 'string', 'max:80'],
            ]);

            $original = UserMessage::findOrFail($id);
            $receiverId = (int) $original->sender_user_id === (int) $request->user()->id
                ? $original->receiver_user_id
                : $original->sender_user_id;

            $reply = UserMessage::create([
                'sender_user_id' => $request->user()->id,
                'receiver_user_id' => $receiverId,
                'subject' => $data['title'] ?: ('Re: ' . ($original->subject ?: 'Message')),
                'message' => $data['details'],
            ]);

            $original->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

            PortalNotification::create([
                'user_id' => $receiverId,
                'notification_type' => 'message',
                'title' => 'New admin reply',
                'description' => Str::limit($reply->message, 120),
                'related_data' => ['message_id' => $reply->id],
            ]);

            return response()->json([
                'id' => $original->id,
                'status' => 'read',
                'payload' => [
                    'title' => $original->subject,
                    'amount' => Str::limit($reply->message, 80),
                    'owner' => optional(User::find($receiverId))->name,
                    'details' => $reply->message,
                ],
            ]);
        }

        if ($module === 'payments') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'string', 'max:255'],
                'status' => ['required', 'string', 'max:80'],
                'details' => ['nullable', 'string', 'max:4000'],
            ]);

            $invoice = PaymentOrder::findOrFail($id);
            $invoice->update([
                'amount' => (float) preg_replace('/[^0-9.]/', '', $data['amount']),
                'status' => $this->paymentStatus($data['status']),
                'notes' => $data['details'] ?? $data['title'],
            ]);

            return response()->json([
                'id' => $invoice->id,
                'status' => $invoice->status,
                'payload' => [
                    'title' => $invoice->notes,
                    'amount' => $invoice->currency . ' ' . number_format((float) $invoice->amount, 2),
                    'owner' => optional(User::find($invoice->user_id))->name,
                    'details' => $invoice->notes,
                ],
            ]);
        }

        if ($module === 'settings') {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'string'],
                'status' => ['nullable', 'string', 'max:80'],
                'group' => ['nullable', 'string', 'max:100'],
            ]);

            DB::table('system_settings')->where('id', $id)->update([
                'setting_key' => $data['title'],
                'setting_value' => $data['amount'],
                'group' => $data['group'] ?? 'general',
                'updated_at' => now(),
            ]);

            return response()->json($this->settingResource(DB::table('system_settings')->where('id', $id)->first()));
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:80'],
            'details' => ['nullable', 'string', 'max:5000'],
            'group' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:120'],
            'image' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        DB::table('system_settings')->where('id', $id)->update([
            'setting_value' => json_encode([
                'title' => $data['title'],
                'amount' => $data['amount'] ?? null,
                'status' => $data['status'],
                'owner' => $data['group'] ?? $request->user()->name,
                'group' => $data['group'] ?? null,
                'type' => $data['type'] ?? null,
                'details' => $data['details'] ?? null,
                'image' => $data['image'] ?? null,
                'location' => $data['location'] ?? null,
                'category' => $data['category'] ?? null,
            ]),
            'updated_at' => now(),
        ]);

        return response()->json($this->settingResource(DB::table('system_settings')->where('id', $id)->first()));
    }

    public function uploadFile(Request $request)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'file' => ['required', 'file', 'max:51200'],
            'purpose' => ['required', 'string', 'max:50'],
            'projectId' => ['nullable', 'integer'],
            'studentUserId' => ['nullable', 'integer'],
            'description' => ['nullable', 'string', 'max:1000'],
            'isPublic' => ['nullable'],
        ]);

        $uploaded = $data['file'];
        $purpose = $data['purpose'] === 'worksheet' ? 'worksheet' : 'project-file';
        $path = $uploaded->store($purpose === 'worksheet' ? 'worksheets' : 'project-files', 'public');
        $publicUrl = $this->publishPublicDiskFile($path);

        $relatedType = null;
        $relatedId = null;
        if ($purpose === 'project-file' && ! empty($data['projectId'])) {
            $relatedType = ServiceRequest::class;
            $relatedId = $data['projectId'];
        }
        if ($purpose === 'worksheet' && ! empty($data['studentUserId'])) {
            $relatedType = User::class;
            $relatedId = $data['studentUserId'];
        }

        $file = FileAttachment::create([
            'uploaded_by_user_id' => $request->user()->id,
            'file_name' => $uploaded->getClientOriginalName(),
            'file_path' => $publicUrl,
            'file_size' => $uploaded->getSize(),
            'file_type' => $purpose === 'worksheet' ? 'worksheet' : ($uploaded->getClientOriginalExtension() ?: 'file'),
            'mime_type' => $uploaded->getMimeType() ?: 'application/octet-stream',
            'related_model_type' => $relatedType,
            'related_model_id' => $relatedId,
            'description' => $data['description'] ?? null,
            'is_public' => filter_var($data['isPublic'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ]);

        if ($purpose === 'project-file' && $relatedId) {
            $project = ServiceRequest::find($relatedId);
            if ($project) {
                PortalNotification::create([
                    'user_id' => $project->requester_user_id,
                    'notification_type' => 'system',
                    'title' => 'Project file uploaded',
                    'description' => $file->file_name . ' is now available in your project folder.',
                    'related_data' => ['project_id' => $project->id, 'file_id' => $file->id],
                ]);
            }
        }

        if ($purpose === 'worksheet' && $relatedId) {
            PortalNotification::create([
                'user_id' => $relatedId,
                'notification_type' => 'system',
                'title' => 'New worksheet uploaded',
                'description' => $file->file_name . ' is available in your worksheets.',
                'related_data' => ['file_id' => $file->id],
            ]);
        }

        return response()->json($this->fileResource($file), 201);
    }

    public function replyMessage(Request $request, UserMessage $message)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'details' => ['nullable', 'string', 'max:5000'],
            'attachment' => ['nullable', 'file', 'max:10240'],
        ]);
        abort_if(empty($data['details']) && ! $request->hasFile('attachment'), 422, 'Reply message or attachment is required.');

        $receiverId = (int) $message->sender_user_id === (int) $request->user()->id
            ? $message->receiver_user_id
            : $message->sender_user_id;

        $reply = UserMessage::create([
            'sender_user_id' => $request->user()->id,
            'receiver_user_id' => $receiverId,
            'subject' => $data['title'] ?: ('Re: ' . ($message->subject ?: 'Message')),
            'message' => $data['details'] ?? '',
        ]);

        $this->attachMessageFile($request, $reply);

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        PortalNotification::create([
            'user_id' => $receiverId,
            'notification_type' => 'message',
            'title' => 'New admin reply',
            'description' => Str::limit($reply->message, 120),
            'related_data' => ['message_id' => $reply->id],
        ]);

        return response()->json([
            'id' => $message->id,
            'status' => 'read',
            'payload' => [
                'title' => $message->subject,
                'amount' => Str::limit($reply->message, 80),
                'owner' => optional(User::find($receiverId))->name,
                'details' => $reply->message,
            ],
        ]);
    }

    public function updateFile(Request $request, FileAttachment $file)
    {
        $this->authorizeAdmin($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'isPublic' => ['nullable'],
        ]);

        $file->update([
            'file_name' => $data['name'],
            'description' => $data['description'] ?? $file->description,
            'is_public' => array_key_exists('isPublic', $data)
                ? filter_var($data['isPublic'], FILTER_VALIDATE_BOOLEAN)
                : $file->is_public,
        ]);

        return response()->json($this->fileResource($file->fresh()));
    }

    public function destroyFile(Request $request, FileAttachment $file)
    {
        $this->authorizeAdmin($request);

        $path = parse_url($file->file_path, PHP_URL_PATH) ?: '';
        if (str_contains($path, '/storage/')) {
            $relative = Str::after($path, '/storage/');
            Storage::disk('public')->delete($relative);
            $publicFile = public_path('storage/' . $relative);
            if (is_file($publicFile)) {
                unlink($publicFile);
            }
        }

        $file->delete();

        return response()->noContent();
    }

    public function destroy(Request $request, string $module, int $id)
    {
        $this->authorizeAdmin($request);
        $this->validateModule($module);

        match ($module) {
            'requests' => ServiceRequest::where('id', $id)->delete(),
            'payments' => PaymentOrder::where('id', $id)->delete(),
            'messages' => UserMessage::where('id', $id)->delete(),
            'courses' => StudentCourseProgress::where('id', $id)->delete(),
            'certifications' => StudentCertification::where('id', $id)->delete(),
            'clients' => User::where('id', $id)->where('role', 'client')->update(['is_active' => false]),
            'settings' => DB::table('system_settings')->where('id', $id)->delete(),
            default => DB::table('system_settings')
                ->where('id', $id)
                ->where('group', $this->groupName($module))
                ->delete(),
        };

        return response()->noContent();
    }

    protected function authorizeAdmin(Request $request): void
    {
        abort_unless(in_array($request->user()?->role, ['admin', 'super_admin'], true), 403);
    }

    protected function validateModule(string $module): void
    {
        abort_unless(in_array($module, $this->modules, true), 404, 'Unknown admin module.');
    }

    protected function groupName(string $module): string
    {
        return 'admin_module_' . $module;
    }

    protected function settingResource(object $row): array
    {
        $decoded = json_decode($row->setting_value, true);
        $payload = is_array($decoded)
            ? $decoded
            : [
                'title' => $row->setting_key,
                'amount' => $row->setting_value,
                'status' => $row->is_editable ? 'editable' : 'locked',
                'group' => $row->group,
            ];

        return [
            'id' => $row->id,
            'status' => $payload['status'] ?? 'active',
            'payload' => $payload,
            'createdAt' => $row->created_at,
            'updatedAt' => $row->updated_at,
        ];
    }

    protected function operationalLogItems(string $module)
    {
        $table = match ($module) {
            'activity-logs' => 'activity_logs',
            'api-logs' => 'api_logs',
            'login-attempts' => 'login_attempts',
            'analytics' => 'user_analytics',
            'system-events' => 'system_events',
        };

        return DB::table($table)
            ->latest('created_at')
            ->limit(100)
            ->get()
            ->map(function ($row) use ($module) {
                $title = match ($module) {
                    'activity-logs' => $row->action_type ?? 'Activity',
                    'api-logs' => trim(($row->method ?? '') . ' ' . ($row->endpoint ?? 'API Request')),
                    'login-attempts' => $row->email ?? 'Login attempt',
                    'analytics' => $row->page_visited ?? $row->action_performed ?? 'Analytics event',
                    'system-events' => $row->event_name ?? 'System event',
                };

                $amount = match ($module) {
                    'activity-logs' => $row->ip_address ?? $row->status ?? '-',
                    'api-logs' => ($row->status_code ?? '-') . ($row->response_time_ms ? ' / ' . $row->response_time_ms . 'ms' : ''),
                    'login-attempts' => $row->ip_address ?? '-',
                    'analytics' => $row->device_type ?? $row->ip_address ?? '-',
                    'system-events' => $row->severity ?? 'info',
                };

                $details = match ($module) {
                    'activity-logs' => $row->action_description ?? '',
                    'api-logs' => $row->error_message ?? '',
                    'login-attempts' => $row->failure_reason ?? ($row->user_agent ?? ''),
                    'analytics' => trim(($row->action_performed ?? '') . "\n" . ($row->referrer ?? '')),
                    'system-events' => is_string($row->event_data ?? null) ? $row->event_data : '',
                };

                return [
                    'id' => $row->id,
                    'status' => $row->status ?? $row->attempt_type ?? $row->severity ?? 'active',
                    'payload' => [
                        'title' => $title,
                        'amount' => $amount,
                        'owner' => isset($row->user_id) ? ('User #' . $row->user_id) : ($row->browser ?? '-'),
                        'details' => $details,
                        'ipAddress' => $row->ip_address ?? null,
                        'userAgent' => $row->user_agent ?? null,
                    ],
                    'createdAt' => $row->created_at,
                ];
            });
    }

    protected function fileResource(FileAttachment $file): array
    {
        return [
            'id' => $file->id,
            'name' => $file->file_name,
            'url' => $this->publishedFileUrl($file->file_path),
            'size' => $file->file_size,
            'type' => $file->file_type,
            'description' => $file->description,
            'isPublic' => $file->is_public,
            'date' => optional($file->created_at)->toDateString(),
        ];
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

    protected function paymentStatus(string $status): string
    {
        return match ($status) {
            'completed', 'paid' => 'completed',
            'processing' => 'processing',
            'failed' => 'failed',
            'refunded' => 'refunded',
            'disputed' => 'disputed',
            default => 'pending',
        };
    }

    protected function extractPaymentInstructions(string $notes): string
    {
        if (! Str::contains($notes, 'Payment instructions:')) {
            return '';
        }

        return trim(Str::after($notes, 'Payment instructions:'));
    }

    protected function extractInvoiceValue(string $text, string $label): string
    {
        if (preg_match('/' . preg_quote($label, '/') . ':\s*(.+)/i', $text, $matches)) {
            return trim($matches[1]);
        }

        return '';
    }

    protected function extractInvoiceSection(string $text, string $label): string
    {
        if (! Str::contains($text, $label . ':')) {
            return '';
        }

        $section = trim(Str::after($text, $label . ':'));
        $section = preg_split('/\n\s*\n|Payment method:|Payment link:|Bank account details:|Extra instructions:/i', $section)[0] ?? $section;

        return trim($section);
    }
}
