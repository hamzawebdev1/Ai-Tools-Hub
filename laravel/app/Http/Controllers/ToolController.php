<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use App\Services\ToolEngine\ToolRegistry;
use App\Services\Analytics\AnalyticsService;
use App\Services\Storage\SecureStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ToolController extends Controller
{
    protected ToolRegistry $toolRegistry;
    protected AnalyticsService $analyticsService;
    protected SecureStorageService $storageService;

    public function __construct(
        ToolRegistry $toolRegistry,
        AnalyticsService $analyticsService,
        SecureStorageService $storageService
    ) {
        $this->toolRegistry = $toolRegistry;
        $this->analyticsService = $analyticsService;
        $this->storageService = $storageService;
    }

    /**
     * Show tool catalogue / directory.
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $search = $request->query('q');

        $query = Tool::query()->active();

        if (!empty($category) && $category !== 'all') {
            $query->where('category', $category);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        $tools = $query->orderBy('is_popular', 'desc')->orderBy('name')->paginate(24);
        $featuredTools = Tool::active()->where('is_featured', true)->limit(6)->get();

        return view('tools.index', compact('tools', 'featuredTools', 'category', 'search'));
    }

    /**
     * Show dedicated single tool page.
     */
    public function show(string $slug)
    {
        $tool = Tool::active()->where('slug', $slug)->firstOrFail();

        // Related tools in same category
        $relatedTools = Tool::active()
            ->where('category', $tool->category)
            ->where('id', '!=', $tool->id)
            ->limit(4)
            ->get();

        return view('tools.show', compact('tool', 'relatedTools'));
    }

    /**
     * Execute tool processing action via HTTP Form / AJAX.
     */
    public function execute(Request $request, string $slug)
    {
        $tool = Tool::active()->where('slug', $slug)->firstOrFail();
        $processor = $this->toolRegistry->getProcessor($tool);

        // 1. Validate inputs
        $validator = Validator::make($request->all(), $processor->getValidationRules());
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // 2. Process tool execution safely
        $result = $processor->process($validator->validated(), $tool);

        // 3. Record non-blocking analytics
        $status = $result['success'] ? 'success' : 'failed';
        $duration = $result['duration_ms'] ?? 0;
        $errorMsg = $result['error'] ?? null;
        $fileSize = $result['metadata']['output_bytes'] ?? null;

        $this->analyticsService->recordUsage($tool, $status, $duration, $fileSize, $errorMsg, $request);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'error' => $result['error'] ?? 'Tool processing failed.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json($result);
    }
}
