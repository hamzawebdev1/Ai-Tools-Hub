<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $editorRole = Role::where('name', 'editor')->first();

        // 1. Primary Super Admin
        User::firstOrCreate(
            ['email' => 'hamza.web.dev5324@gmail.com'],
            [
                'name' => 'Hamza',
                'password' => Hash::make('Admin@ToolsHub2026!'),
                'role_id' => $superAdminRole?->id ?? 1,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // 2. Demo Admin
        User::firstOrCreate(
            ['email' => 'admin@toolshub.io'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('AdminSecurePassword123!'),
                'role_id' => $adminRole?->id ?? 2,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // 3. Demo Editor
        User::firstOrCreate(
            ['email' => 'editor@toolshub.io'],
            [
                'name' => 'Content Editor',
                'password' => Hash::make('EditorSecurePassword123!'),
                'role_id' => $editorRole?->id ?? 3,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
