<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('partner_deletion_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
            $table->string('target_type', 50);
            $table->unsignedBigInteger('target_id')->nullable();
            $table->text('reason');
            $table->string('status', 30)->default('pending');
            $table->text('admin_response')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->index(['partner_id','status']);
            $table->index(['target_type','target_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_deletion_requests');
    }
};