<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Console - ToolsHub Pro')</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex h-full font-sans antialiased bg-slate-950 text-slate-100">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-slate-800 bg-slate-900/80 flex flex-col justify-between p-4">
        <div>
            <div class="flex items-center space-x-3 mb-8 px-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">TH</div>
                <div>
                    <div class="font-bold text-sm text-white">ToolsHub Admin</div>
                    <div class="text-xs text-indigo-400 font-mono">{{ auth()->user()?->role?->display_name ?? 'Staff' }}</div>
                </div>
            </div>

            <nav class="space-y-1 text-sm font-medium">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.dashboard') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Overview
                </a>
                <a href="{{ route('admin.tools.index') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.tools.*') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Tools Registry
                </a>
                @if(auth()->user()->hasPermission('analytics.view'))
                <a href="{{ route('admin.analytics.index') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.analytics.*') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Analytics
                </a>
                @endif
                @if(auth()->user()->hasPermission('users.manage'))
                <a href="{{ route('admin.users.index') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.users.*') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Users & Roles
                </a>
                @endif
                @if(auth()->user()->hasPermission('submissions.manage'))
                <a href="{{ route('admin.submissions.index') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.submissions.*') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Support & Reports
                </a>
                @endif
                @if(auth()->user()->hasPermission('settings.manage'))
                <a href="{{ route('admin.settings.index') }}" class="flex items-center px-3 py-2 rounded-lg {{ request()->routeIs('admin.settings.*') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800' }}">
                    Settings
                </a>
                @endif
            </nav>
        </div>

        <div class="pt-4 border-t border-slate-800">
            <a href="{{ route('tools.index') }}" class="block px-3 py-2 text-xs text-slate-400 hover:text-white transition">
                &larr; Return to Public Site
            </a>
            <form action="{{ route('logout') }}" method="POST" class="mt-2">
                @csrf
                <button type="submit" class="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 transition">
                    Sign Out
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Admin Body -->
    <div class="flex-1 flex flex-col overflow-y-auto">
        <header class="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-950">
            <h1 class="font-bold text-lg text-white">@yield('header_title', 'Dashboard')</h1>
            <div class="text-xs text-slate-400">
                Connected User: <span class="text-white font-medium">{{ auth()->user()?->name }}</span>
            </div>
        </header>

        <main class="p-8">
            @if(session('success'))
                <div class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                    {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                    {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</body>
</html>
