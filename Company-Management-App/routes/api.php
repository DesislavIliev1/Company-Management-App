<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('companies')
->name('company.')
// ->middleware('auth:sanctum')
->group(function () {
    Route::get('/', [CompanyController::class, 'index'])->name('api.index');
    Route::post('/create', [CompanyController::class, 'store'])->name('api.store');
    Route::get('/{id}', [CompanyController::class, 'show'])->name('api.show');
    Route::put('/edit/{id}', [CompanyController::class, 'update'])->name('api.update');
    Route::delete('/delete/{id}', [CompanyController::class, 'destroy'])->name('api.delete');
});