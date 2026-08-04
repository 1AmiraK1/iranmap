//qrcode
document.addEventListener('DOMContentLoaded', function () {
    const imageModal = document.getElementById('imageModal');

    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const qrUrl = button.getAttribute('data-bs-qr-url');
            const cardTitle = button.getAttribute('data-bs-title');

            const modalImage = imageModal.querySelector('#modalQrImage');
            const modalTitle = imageModal.querySelector('#modalTitle');

            modalImage.src = qrUrl;
            if (modalTitle) {
                modalTitle.textContent = cardTitle;
            }
        });

        imageModal.addEventListener('hidden.bs.modal', function () {
            imageModal.querySelector('#modalQrImage').src = '';
        });
    }
});

//pagination
document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('cardsListContainer');
    if (!container) return;

    var abortController = null;

    function loadPage(url, isPopState = false) {
        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();
        var currentSignal = abortController.signal;

        container.classList.add('is-loading');

        fetch(url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal: currentSignal
        })
            .then(function (res) {
                if (!res.ok) throw new Error('server error');
                return res.text();
            })
            .then(function (html) {
                container.innerHTML = html;

                if (!isPopState) {
                    window.history.pushState({}, '', url);
                }
            })
            .catch(function (err) {
                if (err.name === 'AbortError') {
                    console.log('درخواست قبلی لغو شد.');
                    return;
                }
                console.error('خطا در بارگذاری صفحه:', err);
            })
            .finally(function () {
                if (abortController.signal === currentSignal) {
                    container.classList.remove('is-loading');
                }
            });
    }

    container.addEventListener('click', function (e) {
        var link = e.target.closest('.pagination a.page-link');
        if (!link) return;
        e.preventDefault();
        loadPage(link.href);
    });

    window.addEventListener('popstate', function () {
        loadPage(window.location.href, true);
    });
});