<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facade as QrCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class MapController extends Controller
{
    public function index($point = null, $province = null, $county = null)
    {
        try {
            $cards = DB::table('horecas')->get();

            return view('horeca.index', [
                'cards' => $cards,
                'mapCardsJson' => $cards,
                'initialPoint' => $point,
                'initialProvince' => $province,
                'initialCounty' => $county,
            ]);
        } catch (Exception $e) {
            Log::error('خطا در بارگذاری نقشه: ' . $e->getMessage());

            return view('horeca.index', [
                'cards' => [],
                'mapCardsJson' => [],
                'initialPoint' => null,
                'initialProvince' => null,
                'initialCounty' => null,
                'error' => 'مشکلی در برقراری ارتباط با دیتابیس رخ داده است.'
            ]);
        }
        // $cards = [
        //     [
        //         'id' => 'p-12334',
        //         'name' => 'هتل اسپیناس پالاس',
        //         'image' => asset('assets/image/horeca/test.jpg'),
        //         'address' => 'تهران، بزرگراه چمران، خیابان شیخ فضل‌الله نوری، بعد از پل پارک وی، هتل اسپیناس پالاس',
        //         'type' => 'هتل',
        //         'phone' => '9821-8855-5555',
        //         'provinceCode' => 'IR-07',
        //         'countyShapeId' => '6555291',
        //         'lat' => 29.5807,
        //         'lng' => 50.5124,
        //     ],
        //     [
        //         'id' => 'p-12335',
        //         'name' => 'هتل استقلال تهران',
        //         'image' => asset('assets/image/horeca/test.jpg'),
        //         'address' => 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، هتل استقلال تهران',
        //         'type' => 'هتل',
        //         'phone' => '9821-8888-8888',
        //         'provinceCode' => 'IR-07',
        //         'countyShapeId' => '6555291',
        //         'lat' => 35.7686,
        //         'lng' => 51.4104,
        //     ],
        // ];

        // $cardObjects = array_map(function ($item) {
        //     return (object) $item;
        // }, $cards);
    }

    public function generateQr(string $id)
    {
        try {
            $place = DB::table('horecas')->where('id', $id)->first();

            if (!$place) {
                abort(404, 'مکان مورد نظر یافت نشد');
            }

            $geoUri = "geo:{$place->lat},{$place->lng}";

            $qrCode = QrCode::size(250)
                ->margin(1)
                ->generate($geoUri);

            return response($qrCode)->header('Content-Type', 'image/svg+xml');
        } catch (Exception $e) {
            Log::error("خطا در تولید کیوآرکد برای آیدی {$id}: " . $e->getMessage());
            abort(500, 'خطا در تولید بارکد');
        }
    }
}
