<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPreRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'full_name',
        'email',
        'phone',
        'course_name',
        'status',
        'invited_by_user_id',
        'registered_user_id',
        'invited_at',
        'registered_at',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
        'registered_at' => 'datetime',
    ];
}
