<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminStudentController;
use App\Http\Controllers\Api\AdminPortalController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientPortalController;
use App\Http\Controllers\Api\StudentPortalController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\AdminPartnerController;

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
Route::get('/partners/{slug}', [PartnerController::class, 'publicProfile']);
Route::post('/partner-applications', [ApplicationController::class, 'storePartnerApplication']);
Route::get('/services', fn () => response()->json(\App\Models\Service::where('is_active', true)->latest()->get()));
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

    Route::prefix('partner')->middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard', [PartnerController::class, 'dashboard']);
        Route::get('/profile', [PartnerController::class, 'profile']);
        Route::put('/profile', [PartnerController::class, 'updateProfile']);
        Route::get('/services', [PartnerController::class, 'services']);
        Route::post('/services', [PartnerController::class, 'storeService']);
        Route::put('/services/{service}', [PartnerController::class, 'updateService']);
        Route::get('/portfolio', [PartnerController::class, 'portfolio']);
        Route::post('/portfolio', [PartnerController::class, 'storePortfolio']);
        Route::put('/portfolio/{item}', [PartnerController::class, 'updatePortfolio']);
        Route::get('/orders', [PartnerController::class, 'orders']);
        Route::get('/commissions', [PartnerController::class, 'commissions']);
        Route::get('/wallet', [PartnerController::class, 'wallet']);
        Route::get('/resources', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'resources']);
        Route::get('/social-accounts', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'socialAccounts']);
        Route::post('/social-accounts', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'storeSocialAccount']);
        Route::delete('/social-accounts/{socialAccount}', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'deleteSocialAccount']);
        Route::get('/business-email', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'businessEmail']);
        Route::post('/business-email/request', [PartnerController::class, 'requestBusinessEmail']);
        Route::get('/onboarding', [PartnerController::class, 'onboarding']);
        Route::post('/change-requests', [PartnerController::class, 'requestChange']);
        Route::post('/deletion-requests', [PartnerController::class, 'requestDeletion']);
        Route::get('/leads', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'leads']);
        Route::get('/payout-accounts', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'payoutAccounts']);
        Route::post('/payout-accounts', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'storePayoutAccount']);
        Route::post('/payout-requests', [\App\Http\Controllers\Api\PartnerWorkspaceController::class, 'requestPayout']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/partners', [AdminPartnerController::class, 'partners']);
        Route::put('/partners/{partner}/onboarding/{item}', [AdminPartnerController::class, 'updateOnboarding']);
        Route::post('/partners/{partner}/business-email', [AdminPartnerController::class, 'businessEmail']);
        Route::delete('/partners/{partner}', [AdminPartnerController::class, 'deletePartner']);
        Route::get('/partner-change-requests', [AdminPartnerController::class, 'changeRequests']);
        Route::get('/partner-deletion-requests', [AdminPartnerController::class, 'deletionRequests']);
        Route::put('/partner-deletion-requests/{deletionRequest}', [AdminPartnerController::class, 'reviewDeletionRequest']);
        Route::put('/partner-change-requests/{changeRequest}', [AdminPartnerController::class, 'reviewChangeRequest']);
        Route::get('/partner-applications', [AdminPartnerController::class, 'applications']);
        Route::get('/partner-applications/{application}', [AdminPartnerController::class, 'application']);
        Route::put('/partner-applications/{application}', [AdminPartnerController::class, 'updateApplication']);
        Route::post('/partner-applications/{application}/approve', [AdminPartnerController::class, 'approveApplication']);
        Route::get('/commissions', [AdminPartnerController::class, 'commissions']);
        Route::post('/orders/{order}/commission', [AdminPartnerController::class, 'setCommission']);
        Route::post('/commissions/{commission}/release', [AdminPartnerController::class, 'releaseCommission']);
    });
    Route::post('/client/files', [ClientPortalController::class, 'uploadFile']);
    Route::put('/client/profile', [ClientPortalController::class, 'updateProfile']);
});
