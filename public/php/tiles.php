<?php
$z = isset($_GET['z']) ? intval($_GET['z']) : 0;
$x = isset($_GET['x']) ? intval($_GET['x']) : 0;
$y = isset($_GET['y']) ? intval($_GET['y']) : 0;

$disabledPath = __DIR__ . '/../assets/data/disabled.json';
$disabledProvinces = [];
if (file_exists($disabledPath)) {
    $disabledData = json_decode(file_get_contents($disabledPath), true);
    $disabledProvinces = $disabledData['provinces'] ?? [];
}

$province = isset($_GET['province']) ? $_GET['province'] : 'IR-30';
$province = preg_replace('/[^a-zA-Z0-9_-]/', '', $province);

if (in_array($province, $disabledProvinces, true)) {
    header("HTTP/1.0 403 Forbidden");
    exit;
}

$db_path = __DIR__ . "/../../storage/app/tiles/{$province}.mbtiles";

if (!file_exists($db_path)) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

try {
    $db = new PDO("sqlite:$db_path", null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $tms_y = pow(2, $z) - 1 - $y;

    $stmt = $db->prepare("SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row IN (:y_tms, :y_xyz) LIMIT 1");
    
    $stmt->bindValue(':z', $z, PDO::PARAM_INT);
    $stmt->bindValue(':x', $x, PDO::PARAM_INT);
    $stmt->bindValue(':y_tms', $tms_y, PDO::PARAM_INT);
    $stmt->bindValue(':y_xyz', $y, PDO::PARAM_INT);
    
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && !empty($row['tile_data'])) {
        $expires = 60 * 60 * 24 * 7; 
        header("Pragma: public");
        header("Cache-Control: max-age=" . $expires);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $expires) . ' GMT');
        
        header("Content-Type: image/png");

        echo $row['tile_data'];
    } else {
        header("HTTP/1.0 404 Not Found");
    }
} catch (Throwable $e) {
    error_log('tile_server.php error [' . $db_path . ']: ' . $e->getMessage());
    header("HTTP/1.0 500 Internal Server Error");
}
?>