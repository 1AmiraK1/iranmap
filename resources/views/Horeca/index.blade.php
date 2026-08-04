<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Iran Map</title>
    <link rel="stylesheet" href="{{ asset('assets/bootstrap/css/bootstrap.rtl.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/leaflet/leaflet.css') }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
</head>

<body>
    <div class="container-fluid d-flex p-0">
        <div class="list-section">
            <div class="search-section d-flex justify-content-center">
                <h1>Map</h1>
            </div>
            <hr>
            <div class="list-items p-2" id="cardsListContainer">
                @include('horeca.partials.cards-list', ['cards' => $cards])
            </div>
        </div>
        <div class="map-section">
            @include('horeca.partials.map-section')
        </div>
    </div>

    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center d-flex flex-column gap-2">
                    <img id="modalQrImage" src="" alt="qrcode-address" class="img-fluid rounded shadow-lg">

                    <h6 id="modalTitle" class="mt-2 mb-0"></h6>

                    <button type="button" class="btn btn-outline-dark align-self-center btn-sm px-2 py-1 mt-2"
                        data-bs-dismiss="modal">
                        × بستن
                    </button>
                </div>
            </div>
        </div>
    </div>
    <script src="{{ asset('assets/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/leaflet/leaflet.js') }}"></script>

    @php
        $bootstrapData = [
            'initialMapState' => [
                'pointId' => $initialPoint,
                'provinceCode' => $initialProvince,
                'countyShapeId' => $initialCounty,
            ],
            'counts' => [
                'provinces' => $provinceCounts,
                'counties' => $countyCounts,
            ],
        ];
    @endphp

    <script type="application/json" id="map-bootstrap">
    @json($bootstrapData, JSON_UNESCAPED_UNICODE)
    </script>
    <script type="module" src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/events.js') }}"></script>
</body>

</html>
