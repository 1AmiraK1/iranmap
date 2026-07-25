<?php
$z = isset($_GET['z']) ? intval($_GET['z']) : 0;
$x = isset($_GET['x']) ? intval($_GET['x']) : 0;
$y = isset($_GET['y']) ? intval($_GET['y']) : 0;

$province = isset($_GET['province']) ? $_GET['province'] : 'IR-30';
$province = preg_replace('/[^a-zA-Z0-9_-]/', '', $province);

$db_path = __DIR__ . "/assets/tiles/{$province}.mbtiles";

if (!file_exists($db_path)) {
    header("HTTP/1.0 404 Not Found");
    exit;
}

try {
    $db = new PDO("sqlite:$db_path");

    $tms_y = pow(2, $z) - 1 - $y;

    $stmt = $db->prepare("SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row IN (:y_tms, :y_xyz) LIMIT 1");

    $stmt->execute([':z' => $z, ':x' => $x, ':y_tms' => $tms_y, ':y_xyz' => $y]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && !empty($row['tile_data'])) {
        header("Content-Type: image/png");

        // header("Cache-Control: public, max-age=86400"); 

        echo $row['tile_data'];
    } else {
        header("HTTP/1.0 404 Not Found");
    }
} catch (PDOException $e) {
    header("HTTP/1.0 500 Internal Server Error");
}
