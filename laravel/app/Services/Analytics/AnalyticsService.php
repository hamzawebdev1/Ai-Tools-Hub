<?php

namespace App\Services\Analytics;

use App\Models\Tool;
use App\Models\ToolUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Record a tool execution event asynchronously / synchronously.
     */
    public function recordUsage(
        Tool $tool,
        string $status,
        int $durationMs,
        ?int $fileSizeBytes = null,
        ?string $errorMessage = null,
        ?Request $request = null
    ): ToolUsage {
        $req = $request ?? request();
        $ip = $req?->ip() ?? '127.0.0.1';
        $ipHash = hash('sha256', $ip . config('app.key', 'salt'));
        $ua = $req?->userAgent() ?? '';

        $parsedUA = $this->parseUserAgent($ua);

        // Increment total runs count on tool
        $tool->increment('total_runs');

        return ToolUsage::create([
            'tool_id' => $tool->id,
            'tool_slug' => $tool->slug,
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'ip_hash' => $ipHash,
            'country' => $req?->header('CF-IPCountry') ?? 'US',
            'country_code' => $req?->header('CF-IPCountry') ?? 'US',
            'device' => $parsedUA['device'],
            'browser' => $parsedUA['browser'],
            'operating_system' => $parsedUA['os'],
            'status' => $status,
            'processing_duration_ms' => $durationMs,
            'file_size_bytes' => $fileSizeBytes,
            'error_message' => $errorMessage,
            'created_at' => now(),
        ]);
    }

    /**
     * Get aggregated metrics for administrative dashboard.
     */
    public function getDashboardMetrics(): array
    {
        $today = now()->startOfDay();

        $totalRuns = ToolUsage::count();
        $runsToday = ToolUsage::where('created_at', '>=', $today)->count();
        $successRate = $totalRuns > 0
            ? round((ToolUsage::where('status', 'success')->count() / $totalRuns) * 100, 1)
            : 100;

        $topTools = ToolUsage::select('tool_slug', DB::raw('count(*) as count'))
            ->groupBy('tool_slug')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $deviceStats = ToolUsage::select('device', DB::raw('count(*) as count'))
            ->groupBy('device')
            ->get()
            ->pluck('count', 'device')
            ->toArray();

        return [
            'total_runs' => $totalRuns,
            'runs_today' => $runsToday,
            'success_rate' => $successRate,
            'top_tools' => $topTools,
            'devices' => $deviceStats,
        ];
    }

    /**
     * Fast, zero-dependency User-Agent parser.
     */
    protected function parseUserAgent(string $ua): array
    {
        $device = 'desktop';
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
            $device = 'tablet';
        } elseif (preg_match('/(mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop)/i', $ua)) {
            $device = 'mobile';
        }

        $browser = 'Other';
        if (preg_match('/Edg/i', $ua)) $browser = 'Edge';
        elseif (preg_match('/Chrome/i', $ua)) $browser = 'Chrome';
        elseif (preg_match('/Safari/i', $ua)) $browser = 'Safari';
        elseif (preg_match('/Firefox/i', $ua)) $browser = 'Firefox';
        elseif (preg_match('/MSIE|Trident/i', $ua)) $browser = 'IE';

        $os = 'Other';
        if (preg_match('/Windows/i', $ua)) $os = 'Windows';
        elseif (preg_match('/Macintosh|Mac OS/i', $ua)) $os = 'macOS';
        elseif (preg_match('/Linux/i', $ua)) $os = 'Linux';
        elseif (preg_match('/Android/i', $ua)) $os = 'Android';
        elseif (preg_match('/iPhone|iPad|iPod/i', $ua)) $os = 'iOS';

        return [
            'device' => $device,
            'browser' => $browser,
            'os' => $os,
        ];
    }
}
