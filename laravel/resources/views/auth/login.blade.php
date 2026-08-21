@extends('layouts.app')

@section('title', 'Sign In - ' . setting('site_name', 'ToolsHub Pro'))

@section('content')
<div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div class="text-center">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white mx-auto shadow-lg shadow-indigo-500/20">
                TH
            </div>
            <h2 class="mt-4 text-2xl font-extrabold text-white">Sign In to ToolsHub</h2>
            <p class="mt-2 text-xs text-slate-400">Access administrator console, saved tools, and telemetry</p>
        </div>

        <form class="mt-8 space-y-6" action="{{ route('login.post') }}" method="POST">
            @csrf

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input type="email" name="email" value="{{ old('email') }}" required class="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="admin@toolshub.io">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input type="password" name="password" required class="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" placeholder="••••••••">
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2 text-xs text-slate-400">
                        <input type="checkbox" name="remember" class="rounded bg-slate-950 border-slate-700 text-indigo-600">
                        <span>Remember me</span>
                    </label>
                </div>
            </div>

            <button type="submit" class="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition">
                Sign In
            </button>
        </form>
    </div>
</div>
@endsection
