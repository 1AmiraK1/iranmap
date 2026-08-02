{{-- resources/views/horeca/partials/heroca-card.blade.php --}}
<div class="card-item">
    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="{{ $card->image }}" class="img-fluid rounded-start h-100 object-fit-cover"
                    alt="{{ $card->name }}">
            </div>
            <div class="col-md-8">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ $card->name }}</h5>
                    <p class="card-text">آدرس: {{ $card->address }}</p>
                    <p class="card-text rounded bg-primary-subtle m-2 px-2 py-1 small" id="card-type">
                        {{ $card->type }}</p>
                    <p class="card-text d-flex align-items-center gap-1">تلفن: <small class="text-body-secondary"
                            style="direction: ltr; align-self: end;">{{ $card->phone }}</small></p>
                    <button type="button" class="btn btn-outline-primary btn-sm" id="card-info" data-bs-toggle="modal"
                        data-bs-target="#imageModal"
                        data-bs-qr-url="{{ route('qrcode.generate', ['id' => $card->id]) }}"
                        data-bs-title="{{ $card->name }}">
                        اطلاعات بیشتر
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
