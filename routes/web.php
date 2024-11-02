<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

Route::get('/', function () {
    return view('welcome');
});

// AI Writer endpoint
Route::post('/api/ai-generate', [AIController::class, 'generate']);
