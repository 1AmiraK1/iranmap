let abortController = null;

export function updateCardsList(url, isPopState = false) {
    const container = document.getElementById('cardsListContainer');
    if (!container) return;

    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();
    const currentSignal = abortController.signal;

    container.classList.add('is-loading');

    fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        signal: currentSignal
    })
    .then(function (res) {
        if (!res.ok) throw new Error('Server response not ok');
        return res.text();
    })
    .then(function (html) {
        container.innerHTML = html;

        if (!isPopState) {
            window.history.pushState({}, '', url);
        }
    })
    .catch(function (err) {
        if (err.name === 'AbortError') return;
        console.error('خطا در بارگذاری لیست:', err);
    })
    .finally(function () {
        if (abortController && abortController.signal === currentSignal) {
            container.classList.remove('is-loading');
        }
    });
}