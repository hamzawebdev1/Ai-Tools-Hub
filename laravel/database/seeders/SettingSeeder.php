<?php

namespace Database\Seeders;

use App\Services\Settings\SettingsService;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(SettingsService $settingsService): void
    {
        $settingsService->syncDefaults();
    }
}
