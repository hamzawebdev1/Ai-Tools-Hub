<?php

namespace App\Http\Middleware;

use App\Services\Storage\SecureStorageService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyDownloadToken
{
    protected SecureStorageService $storageService;

    public function __construct(SecureStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->route('token');

        if (!$token || strlen($token) !== 64) {
            abort(404, 'Download link token is invalid.');
        }

        $meta = $this->storageService->getFileMetadataByToken($token);
        if (!$meta) {
            abort(404, 'Download link has expired or file does not exist.');
        }

        return $next($request);
    }
}
