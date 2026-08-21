<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', setting('default_seo_title', 'ToolsHub Pro - Free Online Tools & Document Utilities'))</title>
    <meta name="description" content="@yield('meta_description', setting('default_seo_description', 'High performance, secure web tools for documents, images, code, and text.'))">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' }
                    }
                }
            }
        }
    </script>
</head>
<body class="flex flex-col min-h-full font-sans antialiased bg-slate-950 text-slate-100">
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('tools.index') }}" class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                    TH
                </div>
                <span class="font-bold text-lg tracking-tight text-white">{{ setting('site_name', 'ToolsHub Pro') }}</span>
            </a>

            <nav class="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
                <a href="{{ route('tools.index') }}" class="hover:text-white transition">All Tools</a>
                <a href="{{ route('tools.index', ['category' => 'pdf']) }}" class="hover:text-white transition">PDF</a>
                <a href="{{ route('tools.index', ['category' => 'image']) }}" class="hover:text-white transition">Image</a>
                <a href="{{ route('tools.index', ['category' => 'developer']) }}" class="hover:text-white transition">Developer</a>
                <a href="{{ route('tools.index', ['category' => 'text']) }}" class="hover:text-white transition">Text</a>
            </nav>

            <div class="flex items-center space-x-4">
                @auth
                    @if(auth()->user()->isAdmin())
                        <a href="{{ route('admin.dashboard') }}" class="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition">
                            Admin Portal
                        </a>
                    @endif
                    <form action="{{ route('logout') }}" method="POST" class="inline">
                        @csrf
                        <button type="submit" class="text-xs text-slate-400 hover:text-white transition">Logout</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-medium text-slate-300 hover:text-white transition">Sign In</a>
                @endauth
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
        @if(session('success'))
            <div class="max-w-7xl mx-auto px-4 mt-4">
                <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
                    {{ session('success') }}
                </div>
            </div>
        @endif

        @if(session('error'))
            <div class="max-w-7xl mx-auto px-4 mt-4">
                <div class="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                    {{ session('error') }}
                </div>
            </div>
        @endif

        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-900/60 mt-16 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-sm text-slate-400">
                &copy; {{ date('Y') }} {{ setting('site_name', 'ToolsHub Pro') }}. High performance, privacy-first web utilities.
            </div>
            <div class="flex items-center space-x-6 text-xs text-slate-400">
                <span>100% Server & Browser Local Processing</span>
                <span>•</span>
                <span>No Third-Party AI Lock-in</span>
                <span>•</span>
                <span>AES-256 Storage</span>
            </div>
        </div>
    </footer>

    @yield('scripts')
</body>
</html>
