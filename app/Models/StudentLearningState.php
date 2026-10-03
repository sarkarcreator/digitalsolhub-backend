<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentLearningState extends Model
{
    protected $fillable = [
        'user_id','course_id','course_name','typing_passed','typing_wpm',
        'typing_accuracy','current_lesson','word_completed','excel_unlocked',
        'completed_lessons','passed_chapters','word_final_passed','last_lesson_completed_at',
    ];

    protected $casts = [
        'typing_passed'=>'boolean',
        'typing_wpm'=>'float',
        'typing_accuracy'=>'float',
        'current_lesson'=>'integer',
        'word_completed'=>'boolean',
        'excel_unlocked'=>'boolean',
        'completed_lessons'=>'array',
        'passed_chapters'=>'array',
        'word_final_passed'=>'boolean',
        'last_lesson_completed_at'=>'datetime',
    ];
}
