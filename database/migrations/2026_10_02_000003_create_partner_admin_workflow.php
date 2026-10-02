<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('partner_onboarding_items')) {
            Schema::create('partner_onboarding_items', function (Blueprint $t) {
                $t->id();
                $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
                $t->string('item_type');
                $t->string('status')->default('pending')->index();
                $t->text('admin_notes')->nullable();
                $t->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $t->timestamp('reviewed_at')->nullable();
                $t->timestamps();
                $t->unique(['partner_id', 'item_type']);
            });
        }

        if (!Schema::hasTable('partner_change_requests')) {
            Schema::create('partner_change_requests', function (Blueprint $t) {
                $t->id();
                $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
                $t->string('item_type');
                $t->text('message');
                $t->string('status')->default('pending')->index();
                $t->text('admin_response')->nullable();
                $t->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $t->timestamp('reviewed_at')->nullable();
                $t->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_change_requests');
        Schema::dropIfExists('partner_onboarding_items');
    }
};
