<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminStudentController;
use App\Http\Controllers\Api\AdminPortalController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientPortalController;
use App\Http\Controllers\Api\StudentPortalController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin-login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

// AI proxy - server-side gateway to Gemini/GenAI. Configure GEMINI_API_KEY in backend .env to enable.
Route::post('/ai/chat', [\App\Http\Controllers\Api\AiController::class, 'chat']);
Route::post('/applications', [ApplicationController::class, 'store']);
Route::post('/newsletter/subscribe', [ApplicationController::class, 'newsletter']);
Route::get('/public/modules/{module}', [AdminPortalController::class, 'publicIndex']);
Route::get('/certificates/verify/{certificate}', [StudentPortalController::class, 'verifyCertificate']);
Route::get('/badges/verify/{badge}', [StudentPortalController::class, 'verifyBadge']);
Route::get('/attestations/verify/{attestation}', [StudentPortalController::class, 'verifyAttestation']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/admin/students', [AdminStudentController::class, 'index']);
    Route::post('/admin/students', [AdminStudentController::class, 'store']);
    Route::put('/admin/students/{student}', [AdminStudentController::class, 'update']);
    Route::delete('/admin/students/{student}', [AdminStudentController::class, 'destroy']);
    Route::get('/admin/overview', [AdminPortalController::class, 'overview']);
    Route::get('/admin/modules/{module}', [AdminPortalController::class, 'index']);
    Route::post('/admin/modules/{module}', [AdminPortalController::class, 'store']);
    Route::put('/admin/modules/{module}/{id}', [AdminPortalController::class, 'update']);
    Route::delete('/admin/modules/{module}/{id}', [AdminPortalController::class, 'destroy']);
    Route::post('/admin/files', [AdminPortalController::class, 'uploadFile']);
    Route::put('/admin/files/{file}', [AdminPortalController::class, 'updateFile']);
    Route::delete('/admin/files/{file}', [AdminPortalController::class, 'destroyFile']);
    Route::post('/admin/messages/{message}/reply', [AdminPortalController::class, 'replyMessage']);

    Route::get('/student/dashboard', [StudentPortalController::class, 'dashboard']);
    Route::post('/student/courses/enroll', [StudentPortalController::class, 'enroll']);
    Route::put('/student/courses/{course}/progress', [StudentPortalController::class, 'updateProgress']);
    Route::post('/student/support/messages', [StudentPortalController::class, 'sendSupportMessage']);
    Route::put('/student/profile', [StudentPortalController::class, 'updateProfile']);

    Route::get('/client/dashboard', [ClientPortalController::class, 'dashboard']);
    Route::post('/client/projects', [ClientPortalController::class, 'storeProject']);
    Route::put('/client/projects/{project}', [ClientPortalController::class, 'updateProject']);
    Route::delete('/client/projects/{project}', [ClientPortalController::class, 'destroyProject']);
    Route::post('/client/messages', [ClientPortalController::class, 'sendMessage']);
    Route::post('/client/files', [ClientPortalController::class, 'uploadFile']);
    Route::put('/client/profile', [ClientPortalController::class, 'updateProfile']);
});
