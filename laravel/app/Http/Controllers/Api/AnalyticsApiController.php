<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Services\Analytics\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsApiController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Client-side beacon tracking endpoint.
     */
    public function track(Request $request)
    {
        $toolSlug = $request->input('tool_slug');
        $status = $request->input('status', 'success');
        $duration = (int) $request->input('duration_ms', 0);
        $fileSize = $request->input('file_size_bytes');

        $tool = Tool::where('slug', $toolSlug)->first();

        if ($tool) {
            $this->analyticsService->recordUsage($tool, $status, $duration, $fileSize, null, $request);
        }

        return response()->json(['success' => true]);
    }
}
