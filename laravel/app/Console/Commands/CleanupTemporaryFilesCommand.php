<?php

namespace App\Console\Commands;

use App\Services\Storage\SecureStorageService;
use Illuminate\Console\Command;

class CleanupTemporaryFilesCommand extends Command
{
    protected $signature = 'tools:cleanup-temp';
    protected $description = 'Automatically purge expired temporary files from disk storage.';

    public function handle(SecureStorageService $storageService): int
    {
        $this->info('Starting temporary storage cleanup...');
        $deleted = $storageService->cleanupExpiredFiles();
        $this->info("Successfully deleted {$deleted} expired temporary files.");
        return 0;
    }
}
