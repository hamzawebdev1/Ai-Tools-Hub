<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tool Engine Configuration
    |--------------------------------------------------------------------------
    */
    'default_storage_disk' => env('TOOL_STORAGE_DISK', 'local'),
    'temp_directory' => env('TOOL_TEMP_DIR', 'temp_files'),
    'max_upload_size_mb' => env('TOOL_MAX_UPLOAD_MB', 25),
    'temp_file_lifetime_minutes' => env('TOOL_FILE_LIFETIME_MINUTES', 60),

    'categories' => [
        'pdf' => ['name' => 'PDF Tools', 'icon' => 'FileText', 'description' => 'Merge, split, compress, and convert PDF documents.'],
        'image' => ['name' => 'Image Tools', 'icon' => 'Image', 'description' => 'Convert, compress, resize, and optimize images.'],
        'text' => ['name' => 'Text & Content', 'icon' => 'Type', 'description' => 'Case conversion, word counts, diff check, and formatting.'],
        'developer' => ['name' => 'Developer & Code', 'icon' => 'Code2', 'description' => 'JSON, SQL, Hash, Regex, and Minification utilities.'],
        'seo' => ['name' => 'SEO & Webmaster', 'icon' => 'SearchCheck', 'description' => 'Meta tags analysis, robot generators, and URL inspection.'],
        'qr' => ['name' => 'QR & Barcode', 'icon' => 'QrCode', 'description' => 'Custom QR code generation and barcode creators.'],
        'calculators' => ['name' => 'Calculators', 'icon' => 'Calculator', 'description' => 'Financial, unit conversion, and math calculators.'],
    ],
];
