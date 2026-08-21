<?php

namespace App\Services\ToolEngine\Processors;

use App\Models\Tool;
use App\Services\ToolEngine\Contracts\ToolProcessorInterface;
use App\Services\Storage\SecureStorageService;
use Exception;
use Throwable;

abstract class BaseToolProcessor implements ToolProcessorInterface
{
    protected SecureStorageService $storageService;

    public function __construct(SecureStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    /**
     * Helper to wrap execution with timing and error isolation.
     */
    protected function executeSafely(callable $callback): array
    {
        $startTime = microtime(true);

        try {
            $result = $callback();
            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return array_merge([
                'success' => true,
                'duration_ms' => $durationMs,
                'error' => null,
            ], $result);
        } catch (Throwable $e) {
            $durationMs = (int) round((microtime(true) - $startTime) * 1000);

            return [
                'success' => false,
                'duration_ms' => $durationMs,
                'output' => null,
                'download_token' => null,
                'error' => $e->getMessage(),
                'error_code' => $e->getCode() ?: 500,
            ];
        }
    }
}
