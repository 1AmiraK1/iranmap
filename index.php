<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Iran Map</title>

    <link rel="stylesheet" href="assets/leaflet/leaflet.css">

    <link rel="stylesheet" href="src/css/style.css">

</head>

<body>
<div id="map-wrapper" style="position: relative; width: 100%; height: 100vh;">
<div id="map"></div>
<div class="map-controls">
    <button id="zoomIn" class="map-btn svg-icon" data-title="بزرگ‌نمایی"><img src="assets/image/svg/zoom-in.svg" alt="zoom in"></button>
    <button id="zoomOut" class="map-btn svg-icon" data-title="کوچک‌نمایی"><img src="assets/image/svg/zoom-out.svg" alt="zoom out"></button>
    <button id="fitBoundsBtn" class="map-btn svg-icon" data-title="فیت شدن نقشه"><img src="assets/image/svg/fit.svg" alt="fit"></button></button>
    <button id="fullscreenBtn" class="map-btn svg-icon" data-title="تمام صفحه"><img src="assets/image/svg/fullscreen.svg" alt="fullscreen"></button></button>
    <button id="back" class="map-btn svg-icon" data-title="بازگشت به کل کشور"><img src="assets/image/svg/back.svg" alt="back"></button></button>
</div>
</div>
<script src="assets/leaflet/leaflet.js"></script>
<script type="module" src="src/js/app.js"></script>

</body>

</html>