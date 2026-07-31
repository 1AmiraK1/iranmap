<?php

namespace App\Http\Controllers\Horeca;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PDO;
use Throwable;

class TileController extends Controller
{
    public function serve(Request $request, $province, $z, $x, $y)
    {
        $z = (int) $z;
        $x = (int) $x;
        $y = (int) $y;

        $disabledPath = public_path('assets/data/disabled.json');
        $disabledProvinces = [];
        
        if (file_exists($disabledPath)) {
            $disabledData = json_decode(file_get_contents($disabledPath), true);
            $disabledProvinces = $disabledData['provinces'] ?? [];
        }

        $province = preg_replace('/[^a-zA-Z0-9_-]/', '', $province);

        if (in_array($province, $disabledProvinces, true)) {
            abort(403, 'Forbidden');
        }

        $db_path = storage_path("app/tiles/{$province}.mbtiles");

        if (!file_exists($db_path)) {
            abort(404, 'Tile not found');
        }

        try {
            $db = new PDO("sqlite:$db_path", null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);

            $tms_y = pow(2, $z) - 1 - $y;

            $stmt = $db->prepare("SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row IN (:y_tms, :y_xyz) LIMIT 1");
            $stmt->execute([':z' => $z, ':x' => $x, ':y_tms' => $tms_y, ':y_xyz' => $y]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && !empty($row['tile_data'])) {
                return response($row['tile_data'])
                    ->header('Content-Type', 'image/png')
                    ->header('Cache-Control', 'public, max-age=604800, immutable')
                    ->header('Last-Modified', gmdate('D, d M Y H:i:s', filemtime($db_path)) . ' GMT');
            } else {
                abort(404, 'Tile empty');
            }
        } catch (Throwable $e) {
            Log::error('TileController error [' . $db_path . ']: ' . $e->getMessage());
            abort(500, 'Internal Server Error');
        }
    }
}