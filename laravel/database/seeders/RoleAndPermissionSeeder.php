<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Define Permissions
        $permissions = [
            // Tools
            ['name' => 'tools.view', 'display_name' => 'View Tools', 'group' => 'tools'],
            ['name' => 'tools.create', 'display_name' => 'Create Tools', 'group' => 'tools'],
            ['name' => 'tools.edit', 'display_name' => 'Edit Tools', 'group' => 'tools'],
            ['name' => 'tools.delete', 'display_name' => 'Delete Tools', 'group' => 'tools'],
            // Settings
            ['name' => 'settings.view', 'display_name' => 'View Settings', 'group' => 'settings'],
            ['name' => 'settings.manage', 'display_name' => 'Manage Settings', 'group' => 'settings'],
            // Users
            ['name' => 'users.view', 'display_name' => 'View Users', 'group' => 'users'],
            ['name' => 'users.manage', 'display_name' => 'Manage Users & Roles', 'group' => 'users'],
            // Analytics
            ['name' => 'analytics.view', 'display_name' => 'View Analytics', 'group' => 'analytics'],
            ['name' => 'analytics.export', 'display_name' => 'Export Analytics', 'group' => 'analytics'],
            // Submissions
            ['name' => 'submissions.manage', 'display_name' => 'Manage Contact & Bug Submissions', 'group' => 'submissions'],
        ];

        $permissionModels = [];
        foreach ($permissions as $p) {
            $permissionModels[$p['name']] = Permission::firstOrCreate(['name' => $p['name']], $p);
        }

        // 2. Define Roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin'], [
            'display_name' => 'Super Administrator',
            'description' => 'Complete full platform authority over all operations, users, and settings.',
            'is_system' => true,
        ]);

        $admin = Role::firstOrCreate(['name' => 'admin'], [
            'display_name' => 'Administrator',
            'description' => 'Manages tools, settings, users, and views analytics.',
            'is_system' => true,
        ]);

        $editor = Role::firstOrCreate(['name' => 'editor'], [
            'display_name' => 'Editor / Content Manager',
            'description' => 'Manages tools, descriptions, categories, and SEO metadata.',
            'is_system' => true,
        ]);

        $analyticsViewer = Role::firstOrCreate(['name' => 'analytics_viewer'], [
            'display_name' => 'Analytics Viewer',
            'description' => 'Read-only access to operational logs and analytics dashboards.',
            'is_system' => true,
        ]);

        $userRole = Role::firstOrCreate(['name' => 'user'], [
            'display_name' => 'Standard User',
            'description' => 'Registered user with saved history and favorites.',
            'is_system' => true,
        ]);

        // 3. Assign Permissions
        // Super Admin gets all
        $superAdmin->permissions()->sync(Permission::all()->pluck('id'));

        // Admin gets tools, settings, users, analytics, submissions
        $admin->permissions()->sync(Permission::whereIn('name', [
            'tools.view', 'tools.create', 'tools.edit',
            'settings.view', 'settings.manage',
            'users.view', 'users.manage',
            'analytics.view', 'analytics.export',
            'submissions.manage',
        ])->pluck('id'));

        // Editor gets tools and submissions
        $editor->permissions()->sync(Permission::whereIn('name', [
            'tools.view', 'tools.edit', 'submissions.manage',
        ])->pluck('id'));

        // Analytics Viewer gets analytics
        $analyticsViewer->permissions()->sync(Permission::whereIn('name', [
            'analytics.view', 'analytics.export',
        ])->pluck('id'));
    }
}
