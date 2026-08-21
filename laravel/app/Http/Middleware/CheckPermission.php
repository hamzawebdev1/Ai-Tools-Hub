<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!auth()->check()) {
            abort(401);
        }

        $user = auth()->user();
        if (!$user->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'You do not have the required permission.'], 403);
            }
            abort(403, "Forbidden: Missing {$permission} capability.");
        }

        return $next($request);
    }
}
