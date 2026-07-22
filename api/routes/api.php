<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\ProfessionalProfileController;
use App\Http\Controllers\Api\ProjectBriefController;
use App\Http\Controllers\Api\ProjectMatchController;
use App\Http\Controllers\Api\StyleController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => config('app.name')]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/styles', [StyleController::class, 'index']);
Route::get('/professionals/{professionalProfile}', [ProfessionalProfileController::class, 'showPublic']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/professional-profile', [ProfessionalProfileController::class, 'show']);
    Route::post('/professional-profile', [ProfessionalProfileController::class, 'store']);

    Route::post('/project-briefs', [ProjectBriefController::class, 'store']);
    Route::get('/project-briefs/{projectBrief}/matches', [ProjectBriefController::class, 'matches']);

    Route::get('/leads', [ProjectMatchController::class, 'leads']);
    Route::post('/matches/{match}/interest', [ProjectMatchController::class, 'expressInterest']);

    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']);
});
