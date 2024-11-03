<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// AI Writer endpoint - temporarily remove auth for testing
Route::post('ai-generate', [AIController::class, 'generate']);
