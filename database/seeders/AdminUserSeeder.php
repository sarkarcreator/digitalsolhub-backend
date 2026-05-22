<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@digitalsolhub.com'],
            [
                'role' => 'admin',
                'name' => 'Digital Solutions Hub Admin',
                'phone' => '+19176957737',
                'password' => Hash::make('Admin@12345'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
    }
}
