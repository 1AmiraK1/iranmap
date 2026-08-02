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
            <div class="list-items p-2">
                @foreach ($cards as $card)
                    @include('horeca.partials.horeca-card', ['card' => $card])
                @endforeach
            </div>
        </div>
        <div class="map-section">
            @include('horeca.partials.map-section')
        </div>
    </div>

    <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center d-flex flex-column gap-2">
                    <img src="{{ asset('assets/image/uploads/qr.png') }}" alt="qrcode-address"
                        class="img-fluid rounded shadow-lg">
                    <button type="button" class="btn btn-outline-dark align-self-center btn-sm px-2 py-1"
                        data-bs-dismiss="modal" aria-label="Close">
                        × بستن
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('assets/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/leaflet/leaflet.js') }}"></script>
    <script>
        window.horecaCards = @json($mapCardsJson);
        window.initialMapState = {
            pointId: @json($initialPoint),
            provinceCode: @json($initialProvince),
            countyShapeId: @json($initialCounty),
        };
    </script>
    <script type="module" src="{{ asset('js/app.js') }}"></script>
</body>

</html>
