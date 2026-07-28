<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Iran Map</title>
    <link rel="stylesheet" href="assets/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="assets/leaflet/leaflet.css">
    <link rel="stylesheet" href="src/css/style.css">
    <link rel="icon" type="image/x-icon" href="assets/image/ico/fav.ico">
</head>

<body>
    <div class="container-fluid d-flex p-0">
        <div class="list-section">
            <div class="search-section d-flex justify-content-center">
                <h1>Map</h1>
            </div>
            <hr>
            <div class="list-items p-2">
                <div class="card-item">
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img src="assets/image/uploads/test.jpg" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">نام : هتل آریا</h5>
                                    <p class="card-text">آدرس: خراسان رضوی ، مشهد ، خیابان طبرسی</p>
                                    <p class="card-text rounded card-type bg-primary-subtle m-2 px-2 py-1">نوع: هتل</p>
                                    <p class="card-text"><small class="text-body-secondary">تلفن: 0553225752</small></p>


                                    <div class="modal" tabindex="-1">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Modal title</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                        <h2 class="fs-5">Popover in a modal</h2>
                                        <img src="assets/image/uploads/qr.png" alt="qrcode-address">
                                        <hr>
                                        <h2 class="fs-5">Tooltips in a modal</h2>
                                        <p><a href="#" data-bs-toggle="tooltip" title="Tooltip">This link</a> and <a href="#" data-bs-toggle="tooltip" title="Tooltip">that link</a> have tooltips on hover.</p>
                                    </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>






                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="map-section">
            <div id="global-loader">
                <h2>در حال بارگذاری اطلاعات نقشه...</h2>
            </div>
            <div id="map-wrapper">
                <div id="map"></div>
                <div class="map-controls">
                    <button id="zoomIn" class="map-btn svg-icon" data-title="بزرگ‌نمایی"><img src="assets/image/svg/zoom-in.svg" alt="zoom in"></button>
                    <button id="zoomOut" class="map-btn svg-icon" data-title="کوچک‌نمایی"><img src="assets/image/svg/zoom-out.svg" alt="zoom out"></button>
                    <button id="fitBoundsBtn" class="map-btn svg-icon" data-title="فیت شدن نقشه"><img src="assets/image/svg/fit.svg" alt="fit"></button>
                    <button id="fullscreenBtn" class="map-btn svg-icon" data-title="تمام صفحه"><img id="fs-icon" src="assets/image/svg/fullscreen.svg" alt="fullscreen"></button>
                    <button id="back" class="map-btn svg-icon" data-title="بازگشت"><img src="assets/image/svg/back.svg" alt="back"></button>
                </div>
                <div id="activeCountyLabel" class="active-county-label"></div>
            </div>
        </div>
    </div>


    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/leaflet/leaflet.js"></script>
    <script type="module" src="src/js/app.js"></script>
    <script src="assets/js/scripts.js"></script>
</body>

</html>