<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register'])->name('api.registes');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('api.logout');

Route::prefix('companies')
->name('company.')
->middleware('auth:sanctum')
->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('api.index');
    Route::post('/create', [CompanyController::class, 'store'])->name('api.store');
    Route::get('/{id}', [CompanyController::class, 'show'])->name('api.show');
    Route::put('/edit/{id}', [CompanyController::class, 'update'])->name('api.update');
    Route::delete('/delete/{id}', [CompanyController::class, 'destroy'])->name('api.delete');
});