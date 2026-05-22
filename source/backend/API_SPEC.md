# Laravel API Contract

This frontend is now prepared to talk to a Laravel backend with MySQL.

Base URL:

`https://api.digitalsolhub.com/api`

Required endpoints:

## Auth

`POST /auth/login`

Request:

```json
{
  "email": "student@example.com",
  "password": "secret123",
  "role": "student"
}
```

Response:

```json
{
  "token": "plain-text-api-token",
  "user": {
    "id": 1,
    "name": "Ali Ahmed",
    "email": "student@example.com",
    "phone": "+19176957737",
    "role": "student",
    "studentId": "ST10482"
  },
  "message": "Login successful."
}
```

`POST /auth/register`

Student rules:
- `student_id` must already exist in `student_pre_registrations`
- email must match the pre-created admin record
- only `invited` status can register
- after registration, mark record as `registered`

Client rules:
- normal direct signup allowed
- email must be unique

After successful signup:
- send welcome email
- student subject: `Thanks for signup with Digital Solutions Hub`
- client subject: `Thanks for signup with Digital Solutions Hub`

## Admin student onboarding

`GET /admin/students`

Returns pre-registered student rows:

```json
[
  {
    "id": 12,
    "name": "Ali Ahmed",
    "email": "ali@example.com",
    "phone": "+19176957737",
    "studentId": "ST10482",
    "course": "Web Development",
    "status": "invited",
    "createdAt": "2026-05-06T12:00:00Z"
  }
]
```

`POST /admin/students`

Request:

```json
{
  "name": "Ali Ahmed",
  "email": "ali@example.com",
  "phone": "+19176957737",
  "course": "Web Development"
}
```

Behavior:
- generate unique student ID
- create `student_pre_registrations` row
- send invite email to student
- send admin copy to `admin@digitalsolhub.com`

## Contact and forms

`POST /contact`

Store every contact/support message in `contact_messages` and notify:
- `support@digitalsolhub.com`

`POST /newsletter/subscribe`

Store email in `newsletter_subscriptions`

`POST /service-requests`

Store service lead in `service_requests`

## Payments

`POST /payments/create-order`

Supported providers:
- `stripe`
- `paypal`
- `binance`

Request:

```json
{
  "purpose": "Course Enrollment",
  "provider": "binance",
  "currency": "USDT",
  "amount": 120.00
}
```

Response:

```json
{
  "orderNumber": "DSH-20260506-1001",
  "provider": "binance",
  "status": "pending",
  "checkoutUrl": "https://...",
  "providerReference": "..."
}
```

## Email addresses to use

- admin mailbox: `admin@digitalsolhub.com`
- support mailbox: `support@digitalsolhub.com`

## Phone number to use

- `+19176957737`
