<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class MapController extends Controller
{
    protected $perPage = 1;

    public function index($province = null, $county = null, $point = null)
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

            if (!empty($point)) {
                $baseQuery->where('horeca_list.id', (int) $point);
            }
            
            $cards = (clone $baseQuery)
                ->paginate($this->perPage)
                ->appends(request()->query());

            if (request()->ajax()) {
                return view('horeca.partials.cards-list', ['cards' => $cards]);
            }

            $provinceCounts = Cache::remember('province_counts', 86400, function () {
                return DB::table('horeca_list')
                    ->whereNotNull('province_id')
                    ->whereNotNull('lat')
                    ->whereNotNull('lng')
                    ->groupBy('province_id')
                    ->select('province_id', DB::raw('count(*) as count'))
                    ->pluck('count', 'province_id');
            });

            $countyCounts = Cache::remember('county_counts', 86400, function () {
                return DB::table('horeca_list')
                    ->whereNotNull('county_id')
                    ->whereNotNull('lat')
                    ->whereNotNull('lng')
                    ->groupBy('county_id')
                    ->select('county_id', DB::raw('count(*) as count'))
                    ->pluck('count', 'county_id');
            });

            return view('horeca.index', [
                'cards' => $cards,
                'initialProvince' => $province,
                'initialCounty' => $county,
                'initialPoint' => $point,
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
                'initialProvince' => null,
                'initialCounty' => null,
                'initialPoint' => null,
                'provinceCounts' => collect(),
                'countyCounts' => collect(),
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
}
