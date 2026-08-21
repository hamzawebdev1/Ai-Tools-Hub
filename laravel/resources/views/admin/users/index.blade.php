@extends('layouts.admin')

@section('header_title', 'User & Role Management')

@section('content')
<div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                    <th class="p-4">User</th>
                    <th class="p-4">Role</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Last Login</th>
                    <th class="p-4 text-right">Update</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
                @foreach($users as $u)
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="p-4">
                            <div class="font-bold text-white text-sm">{{ $u->name }}</div>
                            <div class="text-slate-400 text-xs">{{ $u->email }}</div>
                        </td>
                        <td class="p-4">
                            <form id="userForm-{{ $u->id }}" action="{{ route('admin.users.updateRole', $u->id) }}" method="POST" class="flex items-center space-x-2">
                                @csrf
                                @method('PUT')
                                <select name="role_id" class="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-white">
                                    @foreach($roles as $role)
                                        <option value="{{ $role->id }}" {{ $u->role_id == $role->id ? 'selected' : '' }}>
                                            {{ $role->display_name }}
                                        </option>
                                    @endforeach
                                </select>
                        </td>
                        <td class="p-4">
                                <select name="status" class="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-white">
                                    <option value="active" {{ $u->status === 'active' ? 'selected' : '' }}>Active</option>
                                    <option value="suspended" {{ $u->status === 'suspended' ? 'selected' : '' }}>Suspended</option>
                                    <option value="pending" {{ $u->status === 'pending' ? 'selected' : '' }}>Pending</option>
                                </select>
                        </td>
                        <td class="p-4 font-mono text-slate-400">
                            {{ $u->last_login_at ? $u->last_login_at->diffForHumans() : 'Never' }}
                        </td>
                        <td class="p-4 text-right">
                                <button type="submit" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold">
                                    Save
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $users->links() }}
    </div>
</div>
@endsection
