@extends('layouts.admin')

@section('header_title', 'Usage Telemetry & Analytics')

@section('content')
<div class="space-y-8">
    <!-- Period Filters -->
    <div class="flex items-center justify-between">
        <div class="text-xs text-slate-400">Displaying operational trends for the past {{ $days }} days</div>
        <div class="flex space-x-2">
            <a href="{{ route('admin.analytics.index', ['days' => 7]) }}" class="px-3 py-1 rounded text-xs {{ $days == 7 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400' }}">7 Days</a>
            <a href="{{ route('admin.analytics.index', ['days' => 30]) }}" class="px-3 py-1 rounded text-xs {{ $days == 30 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400' }}">30 Days</a>
            <a href="{{ route('admin.analytics.index', ['days' => 90]) }}" class="px-3 py-1 rounded text-xs {{ $days == 90 ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400' }}">90 Days</a>
        </div>
    </div>

    <!-- Daily Volume Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider">
            Daily Execution Breakdown
        </div>
        <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                    <th class="p-4">Date</th>
                    <th class="p-4">Total Runs</th>
                    <th class="p-4">Success</th>
                    <th class="p-4">Failed</th>
                    <th class="p-4">Success Rate</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-300">
                @forelse($dailyTrends as $day)
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="p-4 font-mono">{{ $day->date }}</td>
                        <td class="p-4 font-bold text-white">{{ number_format($day->total) }}</td>
                        <td class="p-4 text-emerald-400">{{ number_format($day->success_count) }}</td>
                        <td class="p-4 text-rose-400">{{ number_format($day->failed_count) }}</td>
                        <td class="p-4 font-mono font-semibold">
                            {{ $day->total > 0 ? round(($day->success_count / $day->total) * 100, 1) : 100 }}%
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="p-6 text-center text-slate-500">No execution logs recorded for this timeframe.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Devices & Browsers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 class="font-bold text-sm text-white mb-4">Device Distribution</h3>
            <div class="space-y-3">
                @foreach($devices as $dev)
                    <div class="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                        <span class="capitalize text-slate-300 font-semibold">{{ $dev->device ?: 'Desktop' }}</span>
                        <span class="text-white font-mono font-bold">{{ number_format($dev->count) }}</span>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 class="font-bold text-sm text-white mb-4">Client Browsers</h3>
            <div class="space-y-3">
                @foreach($browsers as $br)
                    <div class="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                        <span class="text-slate-300 font-semibold">{{ $br->browser }}</span>
                        <span class="text-white font-mono font-bold">{{ number_format($br->count) }}</span>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection
