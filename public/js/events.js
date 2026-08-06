import { states } from './config.js';
import { highlightPoint } from './point.js';
import { updateCardsList } from './list.js';
import { map } from './map.js';

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
                if (pointId) {
                    highlightPoint(map, pointId);
                }
            }
        }
    });

    window.addEventListener('popstate', function () {
        updateCardsList(window.location.href, true);
    });
});

//card hover
const container = document.getElementById('cardsListContainer');
if (container) {
    container.addEventListener('mouseover', function(e) {
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

    container.addEventListener('mouseout', function(e) {
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
