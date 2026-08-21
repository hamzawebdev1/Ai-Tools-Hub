@extends('layouts.app')

@section('title', 'All Tools - ' . setting('site_name', 'ToolsHub Pro'))

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Hero / Header -->
    <div class="text-center max-w-3xl mx-auto mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Performance Web Utilities
        </h1>
        <p class="mt-3 text-base text-slate-400">
            Fast, secure, local and server-side processing for PDFs, images, code, and text without third-party AI dependency.
        </p>

        <!-- Search Form -->
        <form action="{{ route('tools.index') }}" method="GET" class="mt-6 flex max-w-md mx-auto">
            <input type="text" name="q" value="{{ $search }}" placeholder="Search tools (e.g. Merge PDF, JSON, Image)..." class="w-full px-4 py-2.5 rounded-l-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
            <button type="submit" class="px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-r-lg transition">
                Search
            </button>
        </form>
    </div>

    <!-- Category Tabs -->
    <div class="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-8">
        <a href="{{ route('tools.index') }}" class="px-4 py-1.5 rounded-full text-xs font-semibold {{ empty($category) ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' }}">
            All Tools
        </a>
        @foreach(['pdf' => 'PDF', 'image' => 'Image', 'developer' => 'Developer', 'text' => 'Text', 'seo' => 'SEO', 'qr' => 'QR'] as $key => $label)
            <a href="{{ route('tools.index', ['category' => $key]) }}" class="px-4 py-1.5 rounded-full text-xs font-semibold {{ $category === $key ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' }}">
                {{ $label }}
            </a>
        @endforeach
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($tools as $tool)
            <a href="{{ route('tools.show', $tool->slug) }}" class="group block p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition shadow-sm">
                <div class="flex items-start justify-between">
                    <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                        {{ $tool->category }}
                    </span>
                    @if($tool->is_popular)
                        <span class="text-xs text-amber-400 font-medium">★ Popular</span>
                    @endif
                </div>

                <h3 class="mt-4 font-bold text-lg text-white group-hover:text-indigo-400 transition">
                    {{ $tool->name }}
                </h3>
                <p class="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {{ $tool->description }}
                </p>

                <div class="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/60">
                    <span>Instant Processing</span>
                    <span class="font-semibold text-indigo-400 group-hover:translate-x-1 transition">Open Tool &rarr;</span>
                </div>
            </a>
        @empty
            <div class="col-span-3 text-center py-16 text-slate-500">
                No tools found matching your criteria.
            </div>
        @endforelse
    </div>

    <div class="mt-10">
        {{ $tools->links() }}
    </div>
</div>
@endsection
