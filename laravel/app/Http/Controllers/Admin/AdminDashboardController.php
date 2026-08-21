<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Models\ToolUsage;
use App\Models\User;
use App\Models\Submission;
use App\Models\SystemLog;
use App\Services\Analytics\AnalyticsService;
use App\Services\Storage\SecureStorageService;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    protected AnalyticsService $analyticsService;
    protected SecureStorageService $storageService;

    public function __construct(AnalyticsService $analyticsService, SecureStorageService $storageService)
    {
        $this->analyticsService = $analyticsService;
        $this->storageService = $storageService;
    }

    public function index()
    {
        $metrics = $this->analyticsService->getDashboardMetrics();

        $stats = [
            'total_tools' => Tool::count(),
            'active_tools' => Tool::active()->count(),
            'total_users' => User::count(),
            'total_runs' => $metrics['total_runs'],
            'runs_today' => $metrics['runs_today'],
            'success_rate' => $metrics['success_rate'],
            'pending_submissions' => Submission::where('status', 'new')->count(),
            'recent_errors' => SystemLog::where('level', 'error')->orderByDesc('id')->limit(5)->get(),
            'top_tools' => $metrics['top_tools'],
        ];

        return view('admin.dashboard', compact('stats'));
    }

    public function purgeTempFiles(Request $request)
    {
        $deleted = $this->storageService->cleanupExpiredFiles();
        return back()->with('success', "Storage cleanup completed: {$deleted} expired temporary files removed.");
    }
}
