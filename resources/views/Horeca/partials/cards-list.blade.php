@if (!empty($error))
    <div class="alert alert-danger text-center m-2" role="alert">
        {{ $error }}
    </div>
@else
    @forelse ($cards as $card)
        @include('horeca.partials.card-item', ['card' => $card])
    @empty
        <p class="text-center text-muted mt-3">موردی برای نمایش وجود ندارد.</p>
    @endforelse

    @if ($cards->hasPages())
        <div class="d-flex justify-content-center p-2">
            {{ $cards->links() }}
        </div>
    @endif
@endif