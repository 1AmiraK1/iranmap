<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Horeca\TileController;

Route::get('/tiles/{province}/{z}/{x}/{y}', [TileController::class, 'serve'])
    ->where('z', '[0-9]+')
    ->where('x', '[0-9]+')
    ->where('y', '[0-9]+');