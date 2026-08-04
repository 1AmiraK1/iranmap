<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facade as QrCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class QrController extends Controller
{
    public function generateQr(string $id)
    {
        try {
            $place = DB::table('horeca_list')->where('id', $id)->first();

            if (!$place) {
                abort(404, 'مکان مورد نظر یافت نشد');
            }

            $geoUri = "geo:{$place->lat},{$place->lng}";

            $qrCode = QrCode::size(250)
                ->margin(1)
                ->generate($geoUri);

            return response($qrCode)->header('Content-Type', 'image/svg+xml');
        } catch (\Throwable $e) {
            Log::error("خطا در تولید کیوآرکد برای آیدی {$id}: " . $e->getMessage());
            abort(500, 'خطا در تولید بارکد');
        }
    }
}
