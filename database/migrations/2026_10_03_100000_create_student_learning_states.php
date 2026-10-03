<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_learning_states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('course_id', 120);
            $table->string('course_name', 255);
            $table->boolean('typing_passed')->default(false);
            $table->decimal('typing_wpm', 8, 2)->nullable();
            $table->decimal('typing_accuracy', 6, 2)->nullable();
            $table->unsignedInteger('current_lesson')->default(0);
            $table->json('completed_lessons')->nullable();
            $table->json('passed_chapters')->nullable();
            $table->boolean('word_final_passed')->default(false);
            $table->boolean('word_completed')->default(false);
            $table->boolean('excel_unlocked')->default(false);
            $table->timestamp('last_lesson_completed_at')->nullable();
            $table->unsignedTinyInteger('daily_lessons_completed')->default(0);
            $table->date('daily_lessons_date')->nullable();
            $table->timestamps();
            $table->unique(['user_id','course_id']);
            $table->index(['user_id','typing_passed','excel_unlocked']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_learning_states');
    }
};
