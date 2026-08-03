<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use SimpleSoftwareIO\QrCode\Facade as QrCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

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

            $mapCards = $baseQuery->get();

            return view('horeca.index', [
                'cards' => $cards,
                'mapCardsJson' => $mapCards,
                'initialPoint' => $point,
                'initialProvince' => $province,
                'initialCounty' => $county,
            ]);
        } catch (Exception $e) {
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
                'mapCardsJson' => [],
                'initialPoint' => null,
                'initialProvince' => null,
                'initialCounty' => null,
                'error' => $error,
            ]);
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
        } catch (Exception $e) {
            Log::error("خطا در تولید کیوآرکد برای آیدی {$id}: " . $e->getMessage());
            abort(500, 'خطا در تولید بارکد');
        }
    }
}
