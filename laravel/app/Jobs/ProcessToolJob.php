<?php

namespace App\Jobs;

use App\Models\ProcessingJob;
use App\Models\Tool;
use App\Services\ToolEngine\ToolRegistry;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessToolJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    protected int $jobRecordId;

    public function __construct(int $jobRecordId)
    {
        $this->jobRecordId = $jobRecordId;
    }

    public function handle(ToolRegistry $registry): void
    {
        $record = ProcessingJob::find($this->jobRecordId);
        if (!$record) {
            return;
        }

        $record->update(['status' => 'processing', 'progress_percent' => 10]);

        try {
            $tool = $record->tool;
            if (!$tool) {
                throw new Exception("Referenced tool does not exist.");
            }

            $processor = $registry->getProcessor($tool);
            $options = $record->options_json ?? [];

            $record->update(['progress_percent' => 50]);

            $result = $processor->process($options, $tool);

            if ($result['success']) {
                $record->update([
                    'status' => 'completed',
                    'progress_percent' => 100,
                    'download_token' => $result['download_token'] ?? null,
                    'duration_ms' => $result['duration_ms'] ?? null,
                    'expires_at' => now()->addHours(24),
                ]);
            } else {
                $record->update([
                    'status' => 'failed',
                    'error_message' => $result['error'] ?? 'Processing failure',
                ]);
            }
        } catch (Exception $e) {
            $record->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}
