<?php

use App\Console\Commands\CleanupTemporaryFilesCommand;
use Illuminate\Support\Facades\Schedule;

// Automatically purge expired temporary files every 30 minutes
Schedule::command(CleanupTemporaryFilesCommand::class)
    ->everyThirtyMinutes()
    ->withoutOverlapping()
    ->runInBackground();
