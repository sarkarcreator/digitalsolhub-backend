<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DshPasswordResetNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $token,
        protected bool $partnerWelcome = false,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', 'https://digitalsolhub.com'), '/');
        $email = urlencode((string) $notifiable->getEmailForPasswordReset());
        $url = $frontendUrl . '/en/reset-password/' . $this->token . '?email=' . $email;

        if ($this->partnerWelcome) {
            return (new MailMessage)
                ->subject('Welcome to Digital Solutions Hub — Partner Account Approved')
                ->greeting('Welcome to DSH, ' . ($notifiable->name ?: 'Partner') . '!')
                ->line('Your DSH Partner application has been approved.')
                ->line('Your partner account is now active. Please set your password using the secure button below.')
                ->action('Set Your Password', $url)
                ->line('This secure link expires according to DSH password-reset security settings.')
                ->line('If you did not apply for a DSH Partner account, please contact DSH support.');
        }

        return (new MailMessage)
            ->subject('Reset Your Digital Solutions Hub Password')
            ->greeting('Hello ' . ($notifiable->name ?: 'there') . '!')
            ->line('We received a request to set or reset your Digital Solutions Hub password.')
            ->action('Set New Password', $url)
            ->line('This secure link expires according to DSH password-reset security settings.')
            ->line('If you did not request this, you can safely ignore this email.');
    }
}
