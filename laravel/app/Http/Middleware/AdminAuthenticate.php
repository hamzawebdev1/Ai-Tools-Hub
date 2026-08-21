<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login')->with('error', 'Administrator access required.');
        }

        $user = auth()->user();
        if (!$user->isAdmin() && !$user->isEditor() && !$user->isAnalyticsViewer()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Forbidden.'], 403);
            }
            abort(403, 'Unauthorized access to administration portal.');
        }

        return $next($request);
    }
}
