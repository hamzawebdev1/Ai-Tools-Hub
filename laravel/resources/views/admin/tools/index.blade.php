@extends('layouts.admin')

@section('header_title', 'Tool Management & Registry')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <form method="GET" action="{{ route('admin.tools.index') }}" class="flex space-x-3">
            <input type="text" name="q" value="{{ $search }}" placeholder="Filter tools..." class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white">
            <select name="category" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white">
                <option value="">All Categories</option>
                @foreach($categories as $cat)
                    <option value="{{ $cat }}" {{ $category === $cat ? 'selected' : '' }}>{{ ucfirst($cat) }}</option>
                @endforeach
            </select>
            <button type="submit" class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Filter</button>
        </form>
    </div>

    <!-- Tools Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                    <th class="p-4">Name & Slug</th>
                    <th class="p-4">Category</th>
                    <th class="p-4">Status</th>
                    <th class="p-4">Total Runs</th>
                    <th class="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
                @foreach($tools as $t)
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="p-4">
                            <div class="font-bold text-white text-sm">{{ $t->name }}</div>
                            <div class="font-mono text-slate-500 text-[11px]">{{ $t->slug }}</div>
                        </td>
                        <td class="p-4 capitalize">{{ $t->category }}</td>
                        <td class="p-4">
                            <form action="{{ route('admin.tools.toggle', $t->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider {{ $t->is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30' }}">
                                    {{ $t->is_active ? 'Active' : 'Disabled' }}
                                </button>
                            </form>
                        </td>
                        <td class="p-4 font-mono font-semibold">{{ number_format($t->total_runs) }}</td>
                        <td class="p-4 text-right">
                            <a href="{{ route('admin.tools.edit', $t->id) }}" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition">
                                Edit Settings
                            </a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $tools->links() }}
    </div>
</div>
@endsection
