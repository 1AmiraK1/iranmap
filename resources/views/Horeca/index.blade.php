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

    @include('horeca.partials.modal')
    
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
