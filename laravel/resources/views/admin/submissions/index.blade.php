@extends('layouts.admin')

@section('header_title', 'Support Tickets & Submissions')

@section('content')
<div class="space-y-6">
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                    <th class="p-4">Ref ID</th>
                    <th class="p-4">Type</th>
                    <th class="p-4">Name & Email</th>
                    <th class="p-4">Subject</th>
                    <th class="p-4">Status</th>
                    <th class="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
                @forelse($submissions as $sub)
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="p-4 font-mono font-semibold text-indigo-400">{{ $sub->reference_id }}</td>
                        <td class="p-4 uppercase font-bold text-[10px] tracking-wider">{{ $sub->type }}</td>
                        <td class="p-4">
                            <div class="font-bold text-white">{{ $sub->name }}</div>
                            <div class="text-slate-500">{{ $sub->email }}</div>
                        </td>
                        <td class="p-4 text-slate-300">{{ $sub->subject }}</td>
                        <td class="p-4">
                            <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase {{ $sub->status === 'new' ? 'bg-indigo-900/40 text-indigo-300' : ($sub->status === 'resolved' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-amber-900/40 text-amber-300') }}">
                                {{ $sub->status }}
                            </span>
                        </td>
                        <td class="p-4 text-right">
                            <form action="{{ route('admin.submissions.update', $sub->id) }}" method="POST" class="inline-flex space-x-1">
                                @csrf
                                @method('PUT')
                                <select name="status" class="rounded bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-white">
                                    <option value="new" {{ $sub->status === 'new' ? 'selected' : '' }}>New</option>
                                    <option value="in_review" {{ $sub->status === 'in_review' ? 'selected' : '' }}>In Review</option>
                                    <option value="resolved" {{ $sub->status === 'resolved' ? 'selected' : '' }}>Resolved</option>
                                </select>
                                <button type="submit" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs">Update</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="p-6 text-center text-slate-500">No submissions or support tickets yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $submissions->links() }}
    </div>
</div>
@endsection
