<?php

namespace App\Console\Commands;

use App\Models\Tool;
use App\Services\ToolEngine\ToolRegistry;
use Illuminate\Console\Command;

class SyncToolsCommand extends Command
{
    protected $signature = 'tools:sync';
    protected $description = 'Synchronize tool definitions from registry and database.';

    public function handle(ToolRegistry $registry): int
    {
        $slugs = $registry->getRegisteredSlugs();
        $this->info("Found " . count($slugs) . " registered tool processors.");

        $count = Tool::count();
        $this->info("Total tools in database: {$count}");

        return 0;
    }
}
