document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('cardsListContainer');
    if (!container) return;

    function loadPage(url) {
        container.classList.add('is-loading');

        fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (res) {
                if (!res.ok) throw new Error('server error');
                return res.text();
            })
            .then(function (html) {
                container.innerHTML = html;
                window.history.pushState({}, '', url); 
            })
            .catch(function (err) {
                console.error('خطا در بارگذاری صفحه:', err);
            })
            .finally(function () {
                container.classList.remove('is-loading');
            });
    }

    container.addEventListener('click', function (e) {
        var link = e.target.closest('.pagination a.page-link');
        if (!link) return;
        e.preventDefault();
        loadPage(link.href);
    });

    window.addEventListener('popstate', function () {
        loadPage(window.location.href);
    });
});