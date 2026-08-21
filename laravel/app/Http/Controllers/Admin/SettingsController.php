<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdateSettingRequest;
use App\Models\Setting;
use App\Models\AdminActivityLog;
use App\Services\Settings\SettingsService;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    protected SettingsService $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        return view('admin.settings.index', compact('settings'));
    }

    public function update(AdminUpdateSettingRequest $request)
    {
        $old = Setting::all()->pluck('value', 'key')->toArray();

        foreach ($request->input('settings', []) as $key => $val) {
            $this->settingsService->set($key, $val);
        }

        AdminActivityLog::log('settings_updated', 'Setting', null, $old, $request->input('settings'));

        return back()->with('success', 'System settings saved successfully.');
    }
}
