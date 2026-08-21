<?php

use App\Http\Controllers\Api\AnalyticsApiController;
use App\Http\Controllers\Api\ToolApiController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public Tools API
    Route::get('/tools', [ToolApiController::class, 'index']);
    Route::get('/tools/{slug}', [ToolApiController::class, 'show']);
    Route::post('/tools/{slug}/execute', [ToolApiController::class, 'execute'])->middleware('throttle:60,1');

    // Secure File Upload via API
    Route::post('/upload', [FileController::class, 'upload'])->middleware('throttle:30,1');

    // Anonymous Analytics Beacon
    Route::post('/analytics/track', [AnalyticsApiController::class, 'track'])->middleware('throttle:120,1');
});
