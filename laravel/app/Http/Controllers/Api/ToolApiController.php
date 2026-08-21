<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Services\ToolEngine\ToolRegistry;
use App\Services\Analytics\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ToolApiController extends Controller
{
    protected ToolRegistry $toolRegistry;
    protected AnalyticsService $analyticsService;

    public function __construct(ToolRegistry $toolRegistry, AnalyticsService $analyticsService)
    {
        $this->toolRegistry = $toolRegistry;
        $this->analyticsService = $analyticsService;
    }

    /**
     * List all active tools.
     */
    public function index()
    {
        $tools = Tool::active()
            ->select(['id', 'name', 'slug', 'category', 'subcategory', 'description', 'icon', 'rating', 'rating_count', 'is_popular', 'is_featured', 'is_new'])
            ->get();

        return response()->json([
            'success' => true,
            'count' => $tools->count(),
            'tools' => $tools,
        ]);
    }

    /**
     * Get single tool metadata.
     */
    public function show(string $slug)
    {
        $tool = Tool::active()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'tool' => $tool,
        ]);
    }

    /**
     * Execute tool via API.
     */
    public function execute(Request $request, string $slug)
    {
        $tool = Tool::active()->where('slug', $slug)->first();

        if (!$tool) {
            return response()->json([
                'success' => false,
                'error' => "Tool '{$slug}' not found or currently inactive.",
            ], Response::HTTP_NOT_FOUND);
        }

        $processor = $this->toolRegistry->getProcessor($tool);
        $validator = Validator::make($request->all(), $processor->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $result = $processor->process($validator->validated(), $tool);

        // Record tracking
        $status = $result['success'] ? 'success' : 'failed';
        $duration = $result['duration_ms'] ?? 0;
        $errorMsg = $result['error'] ?? null;
        $fileSize = $result['metadata']['output_bytes'] ?? null;

        $this->analyticsService->recordUsage($tool, $status, $duration, $fileSize, $errorMsg, $request);

        return response()->json($result);
    }
}
