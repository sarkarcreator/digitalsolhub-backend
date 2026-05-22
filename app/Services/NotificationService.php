<?php

namespace App\Services;

use App\Models\EmailNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    public function send(string $recipientEmail, string $templateKey, string $subject, array $payload = [], ?User $user = null): void
    {
        $notification = EmailNotification::create([
            'user_id' => $user?->id,
            'recipient_email' => $recipientEmail,
            'template_key' => $templateKey,
            'subject' => $subject,
            'payload' => $payload,
            'status' => 'queued',
        ]);

        $body = $this->buildBody($templateKey, $payload);

        try {
            Mail::raw($body, function ($message) use ($recipientEmail, $subject) {
                $message->to($recipientEmail)->subject($subject);
            });

            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Mail send failed', [
                'recipient' => $recipientEmail,
                'subject' => $subject,
                'message' => $exception->getMessage(),
            ]);

            $notification->update([
                'status' => 'failed',
            ]);
        }
    }

    protected function buildBody(string $templateKey, array $payload): string
    {
        return match ($templateKey) {
            'signup_welcome' => "Thanks for signup with Digital Solutions Hub\n\nWelcome {$payload['name']}!\nYour account is now active.",
            'student_invite' => "Hello {$payload['name']},\n\nYour student ID is {$payload['student_id']}.\nUse this ID with your approved email to complete signup on Digital Solutions Hub.",
            default => implode("\n", array_map(
                fn ($key, $value) => "{$key}: ".(is_scalar($value) ? $value : json_encode($value)),
                array_keys($payload),
                array_values($payload)
            )),
        };
    }
}
