<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;

class SubmissionsController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $status = $request->query('status');

        $query = Submission::query();

        if (!empty($type)) {
            $query->where('type', $type);
        }
        if (!empty($status)) {
            $query->where('status', $status);
        }

        $submissions = $query->orderByDesc('id')->paginate(20);

        return view('admin.submissions.index', compact('submissions', 'type', 'status'));
    }

    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:new,in_review,resolved,archived',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $item = Submission::findOrFail($id);
        $item->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'assigned_user_id' => auth()->id(),
        ]);

        AdminActivityLog::log('submission_updated', 'Submission', $item->id);

        return back()->with('success', "Submission {$item->reference_id} marked as {$request->status}.");
    }
}
