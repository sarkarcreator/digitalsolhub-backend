<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminStudentController;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

// AI proxy - server-side gateway to Gemini/GenAI. Configure GEMINI_API_KEY in backend .env to enable.
Route::post('/ai/chat', [\App\Http\Controllers\Api\AiController::class, 'chat']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/admin/students', [AdminStudentController::class, 'index']);
    Route::post('/admin/students', [AdminStudentController::class, 'store']);
});
