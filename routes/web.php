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
use App\Http\Controllers\Horeca\ListController;
use App\Http\Controllers\Horeca\QrController;

Route::get('/', [MapController::class, 'index'])->name('horeca.index');

Route::get('/map/{province?}/{county?}/{point?}', [MapController::class, 'index'])->name('horeca.point.show');
Route::get('/map-points/{provinceCode}', [MapController::class, 'getMapPointsByProvince'])->name('horeca.points.province');
Route::get('/map-search/{province?}/{county?}/{title?}/{address?}', [ListController::class, 'getListOfSearched'])->name('horeca.searched.list');
Route::get('/qrcode/{id}', [QrController::class, 'generateQr'])->where('id', '[0-9]+')->name('qrcode.generate');