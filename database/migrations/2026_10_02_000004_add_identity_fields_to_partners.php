<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->string('legal_name', 160)->nullable()->after('display_name');
            $table->string('cnic', 30)->nullable()->after('legal_name');
            $table->date('date_of_birth')->nullable()->after('cnic');
            $table->string('father_name', 160)->nullable()->after('date_of_birth');
            $table->string('real_phone', 40)->nullable()->after('father_name');
            $table->string('whatsapp_number', 40)->nullable()->after('real_phone');
        });
    }

    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn(['legal_name','cnic','date_of_birth','father_name','real_phone','whatsapp_number']);
        });
    }
};