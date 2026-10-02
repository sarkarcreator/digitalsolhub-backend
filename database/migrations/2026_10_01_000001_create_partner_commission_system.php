<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) $table->string('phone')->nullable();
            if (! Schema::hasColumn('users', 'is_active')) $table->boolean('is_active')->default(true);
        });

        if (!Schema::hasTable('skills')) Schema::create('skills', function (Blueprint $t) {
            $t->id(); $t->string('name'); $t->string('slug')->unique(); $t->string('category')->nullable(); $t->text('description')->nullable(); $t->boolean('is_active')->default(true); $t->timestamps();
        });

        if (!Schema::hasTable('partner_applications')) Schema::create('partner_applications', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('application_number')->unique(); $t->string('full_name'); $t->string('email'); $t->string('phone')->nullable();
            $t->string('country')->nullable(); $t->string('city')->nullable(); $t->text('bio')->nullable(); $t->unsignedInteger('experience_years')->nullable();
            $t->string('availability')->nullable(); $t->string('status')->default('pending')->index(); $t->text('admin_notes')->nullable();
            $t->timestamp('submitted_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('partner_application_skills')) Schema::create('partner_application_skills', function (Blueprint $t) {
            $t->id(); $t->foreignId('application_id')->constrained('partner_applications')->cascadeOnDelete();
            $t->foreignId('skill_id')->constrained('skills')->cascadeOnDelete(); $t->unsignedInteger('experience_years')->nullable(); $t->string('skill_level')->nullable(); $t->timestamps();
            $t->unique(['application_id','skill_id']);
        });

        if (!Schema::hasTable('interviews')) Schema::create('interviews', function (Blueprint $t) {
            $t->id(); $t->foreignId('application_id')->constrained('partner_applications')->cascadeOnDelete();
            $t->foreignId('interviewer_id')->nullable()->constrained('users')->nullOnDelete(); $t->timestamp('scheduled_at')->nullable();
            $t->unsignedInteger('duration_minutes')->default(30); $t->string('meeting_type')->default('online'); $t->string('meeting_url')->nullable();
            $t->string('status')->default('scheduled')->index(); $t->decimal('score',5,2)->nullable(); $t->text('notes')->nullable(); $t->string('recommendation')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('interview_evaluations')) Schema::create('interview_evaluations', function (Blueprint $t) {
            $t->id(); $t->foreignId('interview_id')->constrained('interviews')->cascadeOnDelete();
            $t->string('criteria'); $t->decimal('rating',5,2); $t->text('comments')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('partners')) Schema::create('partners', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $t->string('partner_code')->unique(); $t->string('slug')->unique(); $t->string('display_name'); $t->string('professional_title')->nullable();
            $t->text('bio')->nullable(); $t->string('profile_photo')->nullable(); $t->string('cover_photo')->nullable();
            $t->string('country')->nullable(); $t->string('city')->nullable(); $t->string('timezone')->nullable();
            $t->string('status')->default('active')->index(); $t->string('verification_status')->default('verified'); $t->timestamp('joined_at')->nullable(); $t->timestamp('approved_at')->nullable(); $t->timestamp('suspended_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('partner_portfolios')) Schema::create('partner_portfolios', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->unique()->constrained('partners')->cascadeOnDelete();
            $t->string('headline')->nullable(); $t->text('about')->nullable(); $t->text('experience')->nullable(); $t->text('education')->nullable();
            $t->string('location')->nullable(); $t->string('website')->nullable(); $t->boolean('is_public')->default(true); $t->timestamps();
        });

        if (!Schema::hasTable('portfolio_items')) Schema::create('portfolio_items', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->string('title'); $t->string('slug');
            $t->text('description')->nullable(); $t->string('project_url')->nullable(); $t->string('client_name')->nullable(); $t->string('thumbnail')->nullable();
            $t->json('media')->nullable(); $t->string('category')->nullable(); $t->date('completed_at')->nullable(); $t->boolean('is_featured')->default(false); $t->boolean('is_public')->default(true); $t->unsignedInteger('sort_order')->default(0); $t->timestamps();
            $t->unique(['partner_id','slug']);
        });

        if (!Schema::hasTable('services')) Schema::create('services', function (Blueprint $t) {
            $t->id(); $t->string('name'); $t->string('slug')->unique(); $t->text('description')->nullable(); $t->string('icon')->nullable(); $t->boolean('is_active')->default(true); $t->timestamps();
        });

        if (!Schema::hasTable('partner_services')) Schema::create('partner_services', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->foreignId('service_id')->constrained('services')->cascadeOnDelete();
            $t->string('title'); $t->text('description')->nullable(); $t->string('pricing_type')->default('quote'); $t->decimal('starting_price',15,2)->nullable(); $t->string('currency',10)->default('USD'); $t->unsignedInteger('delivery_days')->nullable();
            $t->boolean('is_active')->default(true); $t->boolean('is_featured')->default(false); $t->timestamps();
        });

        if (!Schema::hasTable('service_packages')) Schema::create('service_packages', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_service_id')->constrained('partner_services')->cascadeOnDelete(); $t->string('name'); $t->text('description')->nullable();
            $t->decimal('price',15,2); $t->string('currency',10)->default('USD'); $t->unsignedInteger('delivery_days')->nullable(); $t->unsignedInteger('revisions')->default(0); $t->json('features')->nullable(); $t->boolean('is_active')->default(true); $t->timestamps();
        });

        if (!Schema::hasTable('leads')) Schema::create('leads', function (Blueprint $t) {
            $t->id(); $t->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete(); $t->foreignId('partner_id')->nullable()->constrained('partners')->nullOnDelete();
            $t->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete(); $t->string('source')->default('website'); $t->string('name'); $t->string('email'); $t->string('phone')->nullable();
            $t->text('message')->nullable(); $t->decimal('budget',15,2)->nullable(); $t->string('currency',10)->default('USD'); $t->string('status')->default('new')->index(); $t->timestamp('assigned_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('orders')) Schema::create('orders', function (Blueprint $t) {
            $t->id(); $t->string('order_number')->unique(); $t->foreignId('client_id')->constrained('users')->cascadeOnDelete(); $t->foreignId('partner_id')->nullable()->constrained('partners')->nullOnDelete();
            $t->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete(); $t->foreignId('package_id')->nullable()->constrained('service_packages')->nullOnDelete();
            $t->string('title'); $t->text('description')->nullable(); $t->decimal('subtotal',15,2); $t->decimal('discount',15,2)->default(0); $t->decimal('total',15,2); $t->string('currency',10)->default('USD');
            $t->string('status')->default('pending')->index(); $t->string('payment_status')->default('pending')->index(); $t->timestamp('started_at')->nullable(); $t->timestamp('completed_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('payments')) Schema::create('payments', function (Blueprint $t) {
            $t->id(); $t->foreignId('order_id')->constrained('orders')->cascadeOnDelete(); $t->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $t->string('provider'); $t->string('external_transaction_id')->nullable()->index(); $t->decimal('amount',15,2); $t->string('currency',10)->default('USD'); $t->string('status')->default('pending')->index();
            $t->json('metadata')->nullable(); $t->timestamp('paid_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('commissions')) Schema::create('commissions', function (Blueprint $t) {
            $t->id(); $t->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
            $t->decimal('gross_amount',15,2); $t->string('commission_type'); $t->decimal('commission_value',15,2); $t->decimal('partner_amount',15,2); $t->decimal('dsh_amount',15,2);
            $t->string('currency',10)->default('USD'); $t->string('status')->default('draft')->index(); $t->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('approved_at')->nullable(); $t->timestamp('payable_at')->nullable(); $t->timestamp('paid_at')->nullable(); $t->text('notes')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('partner_wallets')) Schema::create('partner_wallets', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->unique()->constrained('partners')->cascadeOnDelete(); $t->string('currency',10)->default('USD');
            $t->decimal('pending_balance',15,2)->default(0); $t->decimal('available_balance',15,2)->default(0); $t->decimal('paid_balance',15,2)->default(0); $t->timestamps();
        });

        if (!Schema::hasTable('wallet_transactions')) Schema::create('wallet_transactions', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->foreignId('commission_id')->nullable()->constrained('commissions')->nullOnDelete();
            $t->string('type'); $t->decimal('amount',15,2); $t->string('currency',10)->default('USD'); $t->decimal('balance_after',15,2); $t->string('description')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('payout_accounts')) Schema::create('payout_accounts', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->string('method'); $t->string('account_name')->nullable(); $t->text('account_details')->nullable();
            $t->boolean('is_default')->default(false); $t->boolean('is_verified')->default(false); $t->timestamps();
        });

        if (!Schema::hasTable('payout_requests')) Schema::create('payout_requests', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->foreignId('payout_account_id')->nullable()->constrained('payout_accounts')->nullOnDelete();
            $t->decimal('amount',15,2); $t->string('currency',10)->default('USD'); $t->string('status')->default('pending')->index(); $t->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('approved_at')->nullable(); $t->timestamp('paid_at')->nullable(); $t->string('transaction_reference')->nullable(); $t->text('notes')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('social_accounts')) Schema::create('social_accounts', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete(); $t->string('platform'); $t->string('platform_user_id')->nullable(); $t->string('username')->nullable();
            $t->string('display_name')->nullable(); $t->string('profile_url')->nullable(); $t->text('access_token_encrypted')->nullable(); $t->text('refresh_token_encrypted')->nullable();
            $t->timestamp('token_expires_at')->nullable(); $t->json('scopes')->nullable(); $t->string('status')->default('connected'); $t->timestamp('connected_at')->nullable(); $t->timestamp('last_synced_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('business_email_accounts')) Schema::create('business_email_accounts', function (Blueprint $t) {
            $t->id(); $t->foreignId('partner_id')->unique()->constrained('partners')->cascadeOnDelete(); $t->string('email_address')->unique(); $t->string('mailbox_provider')->nullable();
            $t->string('status')->default('pending'); $t->unsignedInteger('quota')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('reviews')) Schema::create('reviews', function (Blueprint $t) {
            $t->id(); $t->foreignId('client_id')->constrained('users')->cascadeOnDelete(); $t->foreignId('partner_id')->constrained('partners')->cascadeOnDelete();
            $t->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete(); $t->unsignedTinyInteger('rating'); $t->string('title')->nullable(); $t->text('comment')->nullable();
            $t->string('status')->default('published'); $t->timestamps();
        });

        if (!Schema::hasTable('notifications')) Schema::create('notifications', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->constrained('users')->cascadeOnDelete(); $t->string('type'); $t->string('title'); $t->text('message')->nullable(); $t->json('data')->nullable(); $t->timestamp('read_at')->nullable(); $t->timestamps();
        });

        if (!Schema::hasTable('audit_logs')) Schema::create('audit_logs', function (Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); $t->string('action'); $t->string('entity_type'); $t->unsignedBigInteger('entity_id')->nullable();
            $t->json('old_values')->nullable(); $t->json('new_values')->nullable(); $t->ipAddress('ip_address')->nullable(); $t->text('user_agent')->nullable(); $t->timestamps();
            $t->index(['entity_type','entity_id']);
        });
    }

    public function down(): void
    {
        foreach ([
            'audit_logs','notifications','reviews','business_email_accounts','social_accounts','payout_requests','payout_accounts','wallet_transactions','partner_wallets','commissions','payments','orders','leads','service_packages','partner_services','services','portfolio_items','partner_portfolios','partners','interview_evaluations','interviews','partner_application_skills','partner_applications','skills'
        ] as $table) Schema::dropIfExists($table);
    }
};