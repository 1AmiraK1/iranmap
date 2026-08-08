import { states } from './config.js';
import { highlightPoint } from './point.js';
import { updateCardsList } from './list.js';
import { map, mapHandlers } from './map.js';
import { navigateToPoint } from './deeplink.js';
import { UI } from './ui.js';

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

    container.addEventListener('click', function (e) {
        var pageLink = e.target.closest('.pagination a.page-link');
        if (pageLink) {
            e.preventDefault();
            updateCardsList(pageLink.href);
            return;
        }

        var card = e.target.closest('.card-item');
        if (card) {
            var cardLink = e.target.closest('a');

            if (cardLink && container.contains(cardLink)) {
                e.preventDefault();
                window.history.pushState({}, '', cardLink.href);

                const pointId = card.getAttribute('data-point-id');
                const provinceCode = card.getAttribute('data-province-id');
                const countyShapeId = card.getAttribute('data-county-id');
                const listUrl = countyShapeId
                    ? `/map/${encodeURIComponent(provinceCode)}/${encodeURIComponent(countyShapeId)}/${encodeURIComponent(pointId)}`
                    : `/map/${encodeURIComponent(provinceCode)}`;
                updateCardsList(listUrl, true);
                if (provinceCode) {
                    navigateToPoint(map, {
                        provinceCode,
                        countyShapeId,
                        pointId,
                        skipListUpdate: true
                    });
                } else if (pointId) {
                    highlightPoint(map, pointId);
                }
            }
        }
    });

    window.addEventListener('popstate', function () {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts[0] === 'map' && parts[1]) {
            const listUrl = window.location.pathname;
            updateCardsList(listUrl, true);

            navigateToPoint(map, {
                provinceCode: parts[1],
                countyShapeId: parts[2] || null,
                pointId: parts[3] || null,
                skipListUpdate: true
            });
        } else {
            updateCardsList('/', true);
            UI.toggleBackButton(false);
            UI.fadeMap(() => {
                mapHandlers.resetToNationalBounds();
            });
        }
    });
});

//card hover
const container = document.getElementById('cardsListContainer');
if (container) {
    container.addEventListener('mouseover', function (e) {
        const card = e.target.closest('.card-item');
        if (!card) return;

        const pointId = card.getAttribute('data-point-id');

        if (pointId && states.pointMarkers && states.pointMarkers[pointId]) {
            const marker = states.pointMarkers[pointId];
            const markerEl = marker.getElement();

            if (markerEl) {
                markerEl.classList.add('poi-marker--hover');
                marker.setZIndexOffset(1000);
            }
        }
    });

    container.addEventListener('mouseout', function (e) {
        const card = e.target.closest('.card-item');
        if (!card) return;

        const pointId = card.getAttribute('data-point-id');

        if (pointId && states.pointMarkers && states.pointMarkers[pointId]) {
            const marker = states.pointMarkers[pointId];
            const markerEl = marker.getElement();

            if (markerEl) {
                markerEl.classList.remove('poi-marker--hover');
                if (!marker._pinned) {
                    marker.setZIndexOffset(0);
                }
            }
        }
    });
}

//Search Form
document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(searchForm);
            console.log(Object.fromEntries(formData));

            const province = searchForm.elements['province-search']?.value || '';
            const county = searchForm.elements['county-search']?.value || '';
            const title = searchForm.elements['title-search']?.value || '';
            const address = searchForm.elements['address-search']?.value || '';
            const type = searchForm.elements['type-search']?.value || '';

            const url = `/map-search/${encodeURIComponent(province)}/${encodeURIComponent(county)}/${encodeURIComponent(title)}/${encodeURIComponent(address)}/${encodeURIComponent(type)}`;
            
            updateCardsList(url);
        });
    }
});