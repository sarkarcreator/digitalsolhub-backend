<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('student_learning_states', function (Blueprint $table) {
            $table->json('excel_completed_lessons')->nullable();
            $table->json('excel_passed_lessons')->nullable();
            $table->json('excel_passed_chapters')->nullable();
            $table->boolean('excel_final_passed')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('student_learning_states', function (Blueprint $table) {
            $table->dropColumn(['excel_completed_lessons','excel_passed_lessons','excel_passed_chapters','excel_final_passed']);
        });
    }
};
