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

Route::get('/{province}/{county?}/{point?}', [MapController::class, 'index'])
    ->where([
        'province' => '[A-Za-z]{2}-[0-9]+',
        'county'   => '[A-Za-z0-9]+',
        'point'    => '[A-Za-z0-9\-]+',
    ])
    ->name('horeca.point');