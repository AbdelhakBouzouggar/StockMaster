<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\StockMovementController;
//
// Route::middleware(['verify.jwt', 'role:gestionnaire'])->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('produits', ProduitController::class);
    // Route::apiResource('order-items', OrderItemController::class)->only(['store', 'update', 'destroy']);
    
    Route::apiResource('users', UserController::class);
    // });
    
    // Route::middleware(['verify.jwt', 'role:gestionnaire,employe'])->group(function () {
        Route::get('stock-movements', [StockMovementController::class, 'index']);
        Route::apiResource('orders', OrderController::class)->only(['index', 'show']);
        Route::apiResource('produits', ProduitController::class)->only(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
        Route::post('order', [OrderController::class, 'store']);
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);
// });
// Route::middleware(['verify.jwt', 'role:employe'])->group(function () {
    Route::put('stock-mouvements/{id}', [StockMovementController::class, 'update']);
// });

Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::put('stock-movements/{id}', [StockMovementController::class, 'update']);
    Route::post('stock-movements', [StockMovementController::class, 'store']);
// });