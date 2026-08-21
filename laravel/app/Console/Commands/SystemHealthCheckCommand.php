<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SystemHealthCheckCommand extends Command
{
    protected $signature = 'tools:health';
    protected $description = 'Perform production readiness and environmental dependency health checks.';

    public function handle(): int
    {
        $this->info('--- ToolsHub Production System Health Check ---');

        // 1. Database Check
        try {
            DB::connection()->getPdo();
            $this->info('✔ Database Connection: OK (PDO connected)');
        } catch (\Exception $e) {
            $this->error('✖ Database Connection Failed: ' . $e->getMessage());
        }

        // 2. Storage Directory Check
        $tempPath = 'temp_files';
        if (!Storage::disk('local')->exists($tempPath)) {
            Storage::disk('local')->makeDirectory($tempPath);
        }
        $this->info('✔ Storage Directory (temp_files): OK');

        // 3. PHP Extensions Check
        $extensions = ['gd', 'mbstring', 'fileinfo', 'json', 'openssl', 'curl', 'pdo_mysql'];
        foreach ($extensions as $ext) {
            if (extension_loaded($ext)) {
                $this->info("✔ PHP Extension [{$ext}]: Enabled");
            } else {
                $this->warn("⚠ PHP Extension [{$ext}]: Not loaded (some features may be limited)");
            }
        }

        // 4. Tools and Users Count
        $this->info('✔ Total Registered Tools: ' . Tool::count());
        $this->info('✔ Total Registered Users: ' . User::count());

        return 0;
    }
}
