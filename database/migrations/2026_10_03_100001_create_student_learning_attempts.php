<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_learning_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('course_id', 120);
            $table->string('stage', 40);
            $table->unsignedInteger('chapter')->nullable();
            $table->decimal('score', 6, 2)->default(0);
            $table->boolean('passed')->default(false);
            $table->json('answers')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['user_id','course_id','stage','chapter']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_learning_attempts');
    }
};
