import { pointTooltipTemplate } from './templates.js';

let allPoints = [];

export function setPointsData(cards) {
    allPoints = (cards || [])
        .filter(card => card.lat != null && card.lng != null)
        .map(card => ({
            id: String(card.id),
            name: card.name,
            address: card.address,
            lat: Number(card.lat),
            lng: Number(card.lng),
            provinceCode: card.provinceCode,
            countyShapeId: String(card.countyShapeId ?? card.countyId ?? '')
        }));
}

function createPoiIcon() {
    return L.divIcon({
        className: 'poi-marker',
        html: `<div class="poi-marker-shape"></div>`,
        iconSize: [26, 34],
        iconAnchor: [13, 34],
        tooltipAnchor: [0, -30]
    });
}

export function renderAllPoints(map, states) {
    if (states.pointLayer && map.hasLayer(states.pointLayer)) {
        map.removeLayer(states.pointLayer);
    }

    states.pointMarkers = {};

    const markers = allPoints.map(point => {
        const marker = L.marker([point.lat, point.lng], {
            pane: 'points',
            icon: createPoiIcon()
        });
        marker._poiId = point.id;
        marker.bindTooltip(pointTooltipTemplate(point), {
            direction: 'top'
        });
        states.pointMarkers[point.id] = marker;
        return marker;
    });

    states.pointLayer = L.layerGroup(markers).addTo(map);
}

export function highlightPoint(map, states, pointId) {
    if (!states.pointMarkers) return null;
    const targetId = String(pointId);
    let targetMarker = null;

    Object.entries(states.pointMarkers).forEach(([id, marker]) => {
        const el = marker.getElement();
        if (id === targetId) {
            targetMarker = marker;
            if (el) L.DomUtil.addClass(el, 'poi-marker--active');
            marker.openTooltip();
        } else if (el) {
            L.DomUtil.removeClass(el, 'poi-marker--active');
        }
    });

    if (targetMarker) {
        map.panTo(targetMarker.getLatLng(), { animate: true });
    } else {
        console.warn('نقطه‌ی مورد نظر برای هایلایت یافت نشد:', pointId);
    }

    return targetMarker;
}