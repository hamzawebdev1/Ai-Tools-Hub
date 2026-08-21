<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdateToolRequest;
use App\Models\Tool;
use App\Models\AdminActivityLog;
use App\Services\ToolEngine\ToolRegistry;
use Illuminate\Http\Request;

class ToolManagementController extends Controller
{
    protected ToolRegistry $toolRegistry;

    public function __construct(ToolRegistry $toolRegistry)
    {
        $this->toolRegistry = $toolRegistry;
    }

    public function index(Request $request)
    {
        $category = $request->query('category');
        $search = $request->query('q');

        $query = Tool::query();

        if (!empty($category)) {
            $query->where('category', $category);
        }

        if (!empty($search)) {
            $query->where('name', 'LIKE', "%{$search}%")->orWhere('slug', 'LIKE', "%{$search}%");
        }

        $tools = $query->orderBy('name')->paginate(20);
        $categories = Tool::select('category')->distinct()->pluck('category');

        return view('admin.tools.index', compact('tools', 'categories', 'category', 'search'));
    }

    public function edit(int $id)
    {
        $tool = Tool::findOrFail($id);
        return view('admin.tools.edit', compact('tool'));
    }

    public function update(AdminUpdateToolRequest $request, int $id)
    {
        $tool = Tool::findOrFail($id);
        $oldValues = $tool->toArray();

        $tool->update([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'status' => $request->status,
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'is_popular' => $request->boolean('is_popular'),
            'max_file_size_mb' => $request->max_file_size_mb,
            'seo_title' => $request->seo_title,
            'seo_description' => $request->seo_description,
            'seo_keywords' => $request->seo_keywords,
        ]);

        AdminActivityLog::log('tool_updated', 'Tool', $tool->id, $oldValues, $tool->fresh()->toArray());

        return redirect()->route('admin.tools.index')->with('success', "Tool '{$tool->name}' updated successfully.");
    }

    public function toggleStatus(int $id)
    {
        $tool = Tool::findOrFail($id);
        $tool->is_active = !$tool->is_active;
        $tool->status = $tool->is_active ? 'active' : 'maintenance';
        $tool->save();

        AdminActivityLog::log('tool_status_toggled', 'Tool', $tool->id, null, ['is_active' => $tool->is_active]);

        return back()->with('success', "Status of '{$tool->name}' updated to " . ($tool->is_active ? 'Active' : 'Maintenance'));
    }
}
