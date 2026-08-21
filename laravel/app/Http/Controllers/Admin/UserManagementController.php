<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('q');
        $roleId = $request->query('role_id');

        $query = User::with('role');

        if (!empty($search)) {
            $query->where('name', 'LIKE', "%{$search}%")->orWhere('email', 'LIKE', "%{$search}%");
        }

        if (!empty($roleId)) {
            $query->where('role_id', $roleId);
        }

        $users = $query->orderByDesc('id')->paginate(15);
        $roles = Role::all();

        return view('admin.users.index', compact('users', 'roles', 'search', 'roleId'));
    }

    public function updateRole(Request $request, int $id)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'status' => 'required|in:active,suspended,pending',
        ]);

        $user = User::findOrFail($id);

        if ($user->isSuperAdmin() && auth()->id() !== $user->id) {
            return back()->with('error', 'Cannot modify super administrator role.');
        }

        $oldValues = $user->only(['role_id', 'status']);
        $user->update($request->only(['role_id', 'status']));

        AdminActivityLog::log('user_role_updated', 'User', $user->id, $oldValues, $request->only(['role_id', 'status']));

        return back()->with('success', "User '{$user->name}' updated successfully.");
    }
}
