<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Horeca\MapController;

Route::get('/', [MapController::class, 'index'])->name('horeca.index');

Route::get('/map/{point?}/{province?}/{county?}', [MapController::class, 'index'])->name('horeca.map');

Route::get('/qrcode/{id}', [MapController::class, 'generateQr'])->name('qrcode.generate');