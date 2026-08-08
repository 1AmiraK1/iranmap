<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class FormController extends Controller
{
    protected $perPage = 1;

    public function getListOfSearched(Request $request)
    {
        try {
            $province = $request->query('province');
            $county   = $request->query('county');
            $title    = $request->query('title');
            $type     = $request->query('type');
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
            if ($title) {
                $baseQuery->where('horeca_list.title', 'LIKE', '%' . $title . '%');
            }
            if ($type) {
                $baseQuery->where('horeca_list.type_id', $type);
            }
            if ($province) {
                $provinceId = (int) str_replace('IR-', '', $province);
                $baseQuery->where('horeca_list.province_id', $provinceId);
            }
            if ($county) {
                $baseQuery->where('horeca_list.county_id', $county);
            }

            $cards = (clone $baseQuery)
                ->paginate($this->perPage)
                ->appends(request()->query());
            return view('horeca.partials.cards-list', ['cards' => $cards]);
        } catch (\Throwable $e) {
            Log::error('خطا در بارگذاری نقشه: ' . $e->getMessage());
            $error = 'مشکلی در برقراری ارتباط با دیتابیس رخ داده است.';
            $emptyCards = new \Illuminate\Pagination\LengthAwarePaginator([], 0, $this->perPage);

            if (request()->ajax()) {
                return view('horeca.partials.cards-list', [
                    'cards' => $emptyCards,
                    'error' => $error,
                ], 500);
            }
        }
    }

    public function getCountiesByProvince(Request $request)
    {
        try {
            $province = $request->query('province');

            $provinceId = (int) str_replace('IR-', '', $province);

            $counties = DB::select(
                'CALL GetCitiesByProvince(?)',
                [$provinceId]
            );

            return response()->json([
                'success' => true,
                'counties' => $counties,
            ]);
        } catch (\Throwable $e) {
            Log::error('خطا در بارگذاری شهرستان‌ها: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'مشکلی در برقراری ارتباط با دیتابیس رخ داده است.',
                'counties' => [],
            ], 500);
        }
    }
}
