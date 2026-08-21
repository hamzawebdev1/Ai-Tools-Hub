<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUploadRequest;
use App\Services\Storage\SecureStorageService;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{
    protected SecureStorageService $storageService;

    public function __construct(SecureStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    /**
     * Handle secure drag-and-drop / multipart file upload.
     */
    public function upload(FileUploadRequest $request)
    {
        try {
            $file = $request->file('file');
            $clientIp = $request->ip();

            $uploadResult = $this->storageService->storeUploadedFile($file, $clientIp);

            return response()->json([
                'success' => true,
                'message' => 'File uploaded and secured successfully.',
                'file_token' => $uploadResult['token'],
                'uuid' => $uploadResult['uuid'],
                'original_name' => $uploadResult['original_name'],
                'size_bytes' => $uploadResult['size_bytes'],
                'expires_at' => $uploadResult['expires_at'],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Secure token-based controlled download endpoint.
     */
    public function download(string $token)
    {
        $meta = $this->storageService->getFileMetadataByToken($token);
        if (!$meta) {
            abort(404, 'Download link expired or not found.');
        }

        $filePath = $this->storageService->getFilePathByToken($token);
        if (!$filePath || !file_exists($filePath)) {
            abort(404, 'The requested file is no longer available on server storage.');
        }

        return response()->download($filePath, $meta['original_name'], [
            'Content-Type' => $meta['mime_type'] ?? 'application/octet-stream',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, private',
        ]);
    }
}
