<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facade as QrCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MapController extends Controller
{
    protected $perPage = 1;

    public function index($point = null, $province = null, $county = null)
    {
        try {
            $baseQuery = DB::table('horeca_list')
                ->leftJoin('horeca_images', function ($join) {
                    $join->on('horeca_list.id', '=', 'horeca_images.horeca_id')
                        ->where('horeca_images.is_main', 1);
                })
                ->leftJoin('horeca_types', 'horeca_list.type_id', '=', 'horeca_types.id')
                ->select(
                    'horeca_list.*',
                    'horeca_images.image_path as main_image',
                    'horeca_types.type_title'
                )
                ->orderBy('horeca_list.id');

            $cards = (clone $baseQuery)
                ->paginate($this->perPage)
                ->appends(request()->query());

            if (request()->ajax()) {
                return view('horeca.partials.cards-list', ['cards' => $cards]);
            }

            $provinceCounts = DB::table('horeca_list')
                ->whereNotNull('province_id')
                ->groupBy('province_id')
                ->select('province_id', DB::raw('count(*) as count'))
                ->pluck('count', 'province_id');

            $countyCounts = DB::table('horeca_list')
                ->whereNotNull('county_id')
                ->groupBy('county_id')
                ->select('county_id', DB::raw('count(*) as count'))
                ->pluck('count', 'county_id');

            return view('horeca.index', [
                'cards' => $cards,
                'initialPoint' => $point,
                'initialProvince' => $province,
                'initialCounty' => $county,
                'provinceCounts' => $provinceCounts, 
                'countyCounts' => $countyCounts,     
            ]);
        } catch (\Throwable $e) {
            Log::error('خطا در بارگذاری نقشه: ' . $e->getMessage());
            $error = 'مشکلی در برقراری ارتباط با دیتابیس رخ داده است.';
            $emptyCards = new \Illuminate\Pagination\LengthAwarePaginator([], 0, $this->perPage);

            if (request()->ajax()) {
                return view('horeca.partials.cards-list', [
                    'cards' => $emptyCards,
                    'error' => $error,
                ]);
            }

            return view('horeca.index', [
                'cards' => $emptyCards,
                'initialPoint' => null,
                'initialProvince' => null,
                'initialCounty' => null,
                'error' => $error,
            ]);
        }
    }

    public function getMapPointsByProvince(string $provinceCode)
    {
        try {
            $points = DB::table('horeca_list')
                ->where('horeca_list.province_id', $provinceCode) 
                ->select(
                    'horeca_list.id',
                    'horeca_list.lat',
                    'horeca_list.lng',
                    'horeca_list.title',
                    'horeca_list.address',
                    'horeca_list.province_id',
                    'horeca_list.county_id'
                )->get();

            return response()->json($points);
        } catch (\Throwable $e) {
            Log::error('خطا در بارگذاری نقاط استان: ' . $e->getMessage());
            return response()->json(['error' => 'Server Error'], 500);
        }
    }

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
