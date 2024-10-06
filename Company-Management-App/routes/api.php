<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TaskController;
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

Route::prefix('employees')
->name('employee.')
->middleware('auth:sanctum')
->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('api.index');
    Route::post('/create', [EmployeeController::class, 'store'])->name('api.store');
    Route::get('/{id}', [EmployeeController::class, 'show'])->name('api.show');
    Route::put('/edit/{id}', [EmployeeController::class, 'update'])->name('api.update');
    Route::delete('/delete/{id}', [EmployeeController::class, 'destroy'])->name('api.delete');
});

Route::prefix('task')
->name('task.')
->middleware('auth:sanctum')
->group(function () {
    Route::get('/', [TaskController::class, 'index'])->name('api.index');
    Route::post('/create', [TaskController::class, 'store'])->name('api.store');
    Route::get('/{id}', [TaskController::class, 'show'])->name('api.show');
    Route::put('/edit/{id}', [TaskController::class, 'update'])->name('api.update');
    Route::delete('/delete/{id}', [TaskController::class, 'destroy'])->name('api.delete');
});

// Route::middleware('auth:sanctum')->get('/auth/verify', function (Request $request) {
//     return response()->json(['isAuthenticated' => true]);
//  });
Route::middleware('auth:sanctum')->get('/auth/verify', [AuthController::class, 'verify']);