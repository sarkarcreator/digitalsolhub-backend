<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLearningAttempt extends Model
{
    protected $fillable = [
        'user_id','course_id','stage','chapter','score','passed','answers','metadata',
    ];

    protected $casts = [
        'chapter'=>'integer',
        'score'=>'float',
        'passed'=>'boolean',
        'answers'=>'array',
        'metadata'=>'array',
    ];
}
