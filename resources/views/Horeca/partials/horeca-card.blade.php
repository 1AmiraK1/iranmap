<div class="card-item shadow" data-point-id="{{ $card->id }}" data-province-id="{{ $card->province_id }}" data-county-id="{{ $card->county_id }}">    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <a href="{{ route('horeca.point.show', [
                    'province' => $card->province_id,
                    'county' => $card->county_id,
                    'point' => $card->id,
                ]) }}?{{ request()->getQueryString() }}"
                    class="card-links">
                    <img src="{{ $card->main_image ? asset('assets/images/horeca/' . $card->main_image) : asset('assets/images/test.jpg') }}"
                        class="img-fluid mx-auto rounded-start w-100 object-fit-cover" alt="{{ $card->title }}"
                        style="height: 180px;">
                </a>
                <p class="card-text rounded bg-danger-subtle m-2 px-2 py-1 small card-info" data-bs-toggle="modal"
                    data-bs-target="#imageModal" data-bs-qr-url="{{ route('qrcode.generate', ['id' => $card->id]) }}"
                    data-bs-title="{{ $card->address }}">
                    اطلاعات بیشتر
                </p>
            </div>
            <div class="col-md-8">
                <a href="{{ route('horeca.point.show', [
                    'province' => $card->province_id,
                    'county' => $card->county_id,
                    'point' => $card->id,
                ]) }}?{{ request()->getQueryString() }}"
                    class="card-links">
                    <div class="card-body d-flex flex-column h-100 justify-content-between p-2">
                        <h5 class="card-title">{{ $card->title }}</h5>
                        <p class="card-text">آدرس: {{ $card->address }}</p>
                        <p class="card-text rounded bg-primary-subtle m-2 px-2 py-1 small card-type">
                            {{ $card->type_title }}</p>
                        <p class="card-text d-flex align-items-center gap-1">تلفن: <small class="text-body-secondary"
                                style="direction: ltr; align-self: end;">{{ $card->phone }}</small></p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>
