@extends('layouts.admin')

@section('header_title', 'Enterprise Operations Dashboard')

@section('content')
<div class="space-y-8">
    <!-- Top Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered Tools</div>
            <div class="mt-2 text-3xl font-extrabold text-white">{{ $stats['total_tools'] }}</div>
            <div class="mt-1 text-xs text-emerald-400 font-medium">{{ $stats['active_tools'] }} active in production</div>
        </div>

        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invocations</div>
            <div class="mt-2 text-3xl font-extrabold text-indigo-400">{{ number_format($stats['total_runs']) }}</div>
            <div class="mt-1 text-xs text-slate-500">{{ $stats['runs_today'] }} executed today</div>
        </div>

        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Success Rate</div>
            <div class="mt-2 text-3xl font-extrabold text-emerald-400">{{ $stats['success_rate'] }}%</div>
            <div class="mt-1 text-xs text-slate-500">Native PHP execution</div>
        </div>

        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Accounts</div>
            <div class="mt-2 text-3xl font-extrabold text-white">{{ $stats['total_users'] }}</div>
            <div class="mt-1 text-xs text-slate-500">Admins & team members</div>
        </div>
    </div>

    <!-- Storage Maintenance Actions -->
    <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
            <h3 class="font-bold text-sm text-white">Storage Lifecycle & Security Purge</h3>
            <p class="text-xs text-slate-400 mt-1">Permanently remove expired temporary files and orphan tokens from disk.</p>
        </div>
        <form action="{{ route('admin.storage.cleanup') }}" method="POST">
            @csrf
            <button type="submit" class="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-lg transition">
                Purge Expired Temp Files
            </button>
        </form>
    </div>

    <!-- Top Tools & Recent System Errors -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Top Tools -->
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 class="font-bold text-sm text-white mb-4">Top Executed Tools</h3>
            <div class="space-y-3">
                @forelse($stats['top_tools'] as $item)
                    <div class="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span class="font-mono text-xs text-indigo-300 font-semibold">{{ $item->tool_slug }}</span>
                        <span class="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded">{{ number_format($item->count) }} runs</span>
                    </div>
                @empty
                    <div class="text-xs text-slate-500 py-4 text-center">No tool execution recorded yet.</div>
                @endforelse
            </div>
        </div>

        <!-- Recent Logs -->
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 class="font-bold text-sm text-white mb-4">Recent System Logs & Alerts</h3>
            <div class="space-y-3">
                @forelse($stats['recent_errors'] as $log)
                    <div class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs">
                        <div class="flex items-center justify-between text-rose-400 font-semibold">
                            <span>[{{ strtoupper($log->channel) }}] {{ $log->created_at->diffForHumans() }}</span>
                        </div>
                        <p class="text-slate-300 mt-1">{{ $log->message }}</p>
                    </div>
                @empty
                    <div class="text-xs text-emerald-400 py-4 text-center">All systems healthy. No recent error alerts.</div>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
