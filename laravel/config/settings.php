<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Application Settings
    |--------------------------------------------------------------------------
    */
    'site_name' => env('APP_NAME', 'ToolsHub Pro'),
    'contact_email' => env('APP_CONTACT_EMAIL', 'support@toolshub.io'),
    'support_email' => env('APP_SUPPORT_EMAIL', 'support@toolshub.io'),
    'enable_guest_usage' => env('ENABLE_GUEST_USAGE', true),
    'enable_registration' => env('ENABLE_REGISTRATION', true),
    'maintenance_mode' => env('APP_MAINTENANCE', false),
];
