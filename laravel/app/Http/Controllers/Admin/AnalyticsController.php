<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ToolUsage;
use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $startDate = now()->subDays($days);

        // Daily trend
        $dailyTrends = ToolUsage::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as total'),
            DB::raw('sum(case when status = "success" then 1 else 0 end) as success_count'),
            DB::raw('sum(case when status = "failed" then 1 else 0 end) as failed_count')
        )
        ->where('created_at', '>=', $startDate)
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        // Device breakdown
        $devices = ToolUsage::select('device', DB::raw('count(*) as count'))
            ->where('created_at', '>=', $startDate)
            ->groupBy('device')
            ->get();

        // Browser breakdown
        $browsers = ToolUsage::select('browser', DB::raw('count(*) as count'))
            ->where('created_at', '>=', $startDate)
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(6)
            ->get();

        // Top tools by usage
        $topTools = ToolUsage::select('tool_slug', DB::raw('count(*) as count'), DB::raw('avg(processing_duration_ms) as avg_duration'))
            ->where('created_at', '>=', $startDate)
            ->groupBy('tool_slug')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return view('admin.analytics.index', compact('dailyTrends', 'devices', 'browsers', 'topTools', 'days'));
    }
}
