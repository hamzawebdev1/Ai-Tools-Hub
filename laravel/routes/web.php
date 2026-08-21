<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ToolManagementController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\SubmissionsController;
use App\Http\Middleware\AdminAuthenticate;
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\VerifyDownloadToken;
use Illuminate\Support\Facades\Route;

Route::middleware([SecurityHeaders::class])->group(function () {
    // 1. Public Tool Catalog & Dedicated Tool Pages
    Route::get('/', [ToolController::class, 'index'])->name('home');
    Route::get('/tools', [ToolController::class, 'index'])->name('tools.index');
    Route::get('/tools/{slug}', [ToolController::class, 'show'])->name('tools.show');
    Route::post('/tools/{slug}/execute', [ToolController::class, 'execute'])->name('tools.execute');

    // 2. Centralized File Upload & Secure Token-Based Downloads
    Route::post('/files/upload', [FileController::class, 'upload'])->name('files.upload');
    Route::get('/download/{token}', [FileController::class, 'download'])
        ->middleware(VerifyDownloadToken::class)
        ->name('tools.download');

    // 3. Authentication Routes
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // 4. Enterprise Admin Portal
    Route::prefix('admin')
        ->middleware([AdminAuthenticate::class])
        ->name('admin.')
        ->group(function () {
            Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
            Route::post('/storage/cleanup', [AdminDashboardController::class, 'purgeTempFiles'])->name('storage.cleanup');

            // Tools Management
            Route::prefix('tools')->name('tools.')->group(function () {
                Route::get('/', [ToolManagementController::class, 'index'])->name('index');
                Route::get('/{id}/edit', [ToolManagementController::class, 'edit'])->name('edit');
                Route::put('/{id}', [ToolManagementController::class, 'update'])->name('update');
                Route::post('/{id}/toggle', [ToolManagementController::class, 'toggleStatus'])->name('toggle');
            });

            // Settings
            Route::middleware([CheckPermission::class . ':settings.manage'])->group(function () {
                Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
                Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
            });

            // User Management
            Route::middleware([CheckPermission::class . ':users.manage'])->group(function () {
                Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
                Route::put('/users/{id}/role', [UserManagementController::class, 'updateRole'])->name('users.updateRole');
            });

            // Analytics
            Route::middleware([CheckPermission::class . ':analytics.view'])->group(function () {
                Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
            });

            // Submissions & Support
            Route::middleware([CheckPermission::class . ':submissions.manage'])->group(function () {
                Route::get('/submissions', [SubmissionsController::class, 'index'])->name('submissions.index');
                Route::put('/submissions/{id}', [SubmissionsController::class, 'updateStatus'])->name('submissions.update');
            });
        });
});
