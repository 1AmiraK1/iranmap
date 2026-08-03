import { pointPanelTemplate } from './templates.js';
import { UI } from './ui.js';

let allPoints = [];

const ICON_WIDTH = 26;
const ICON_HEIGHT = 34;

export function setPointsData(cards) {
    allPoints = (cards || [])
        .filter(card => card.lat != null && card.lng != null)
        .map(card => ({
            id: String(card.id),
            name: card.title,
            address: card.address,
            lat: Number(card.lat),
            lng: Number(card.lng),
            provinceCode: card.province_id,
            countyShapeId: String(card.county_id ?? '')
        }));
}

function createPoiIcon() {
    return L.divIcon({
        className: 'poi-marker',
        html: `<div class="poi-marker-shape"></div>`,
        iconSize: [ICON_WIDTH, ICON_HEIGHT],
        iconAnchor: [ICON_WIDTH / 2, ICON_HEIGHT]
    });
}

function setMarkerActiveStyle(marker, active) {
    const el = marker.getElement();
    if (!el) return;
    if (active) {
        L.DomUtil.addClass(el, 'poi-marker--active');
    } else {
        L.DomUtil.removeClass(el, 'poi-marker--active');
    }
}

function pinMarker(states, marker) {
    marker._pinned = true;
    setMarkerActiveStyle(marker, true);
    states.activePointMarker = marker;
    UI.showPointPanel(pointPanelTemplate(marker._pointData), () => unpinMarker(states, marker));
}

function unpinMarker(states, marker) {
    marker._pinned = false;
    setMarkerActiveStyle(marker, false);
    if (states.activePointMarker === marker) {
        states.activePointMarker = null;
    }
    UI.hidePointPanel();
}

export function unpinActivePoint(states) {
    if (states.activePointMarker) {
        unpinMarker(states, states.activePointMarker);
    }
}

function renderPoints(map, states, points) {
    if (states.pointLayer && map.hasLayer(states.pointLayer)) {
        map.removeLayer(states.pointLayer);
    }

    states.pointMarkers = {};
    states.activePointMarker = null;
    UI.hidePointPanel();

    const markers = points.map(point => {
        const marker = L.marker([point.lat, point.lng], {
            pane: 'points',
            icon: createPoiIcon()
        });
        marker._poiId = point.id;
        marker._pinned = false;
        marker._pointData = point;

        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (marker._pinned) {
                unpinMarker(states, marker);
                return;
            }
            if (states.activePointMarker) {
                unpinMarker(states, states.activePointMarker);
            }
            pinMarker(states, marker);
        });

        states.pointMarkers[point.id] = marker;
        return marker;
    });

    states.pointLayer = L.layerGroup(markers).addTo(map);
}

export function clearPoints(map, states) {
    renderPoints(map, states, []);
}

export function renderPointsForProvince(map, states, provinceCode) {
    const filtered = allPoints.filter(point => point.provinceCode === provinceCode);
    renderPoints(map, states, filtered);
}

export function renderPointsForCounty(map, states, countyShapeId) {
    const targetId = String(countyShapeId);
    const filtered = allPoints.filter(point => point.countyShapeId === targetId);
    renderPoints(map, states, filtered);
}

export function highlightPoint(map, states, pointId) {
    if (!states.pointMarkers) return null;
    const targetId = String(pointId);
    const targetMarker = states.pointMarkers[targetId] || null;

    if (states.activePointMarker && states.activePointMarker !== targetMarker) {
        unpinMarker(states, states.activePointMarker);
    }

    if (targetMarker) {
        pinMarker(states, targetMarker);
        map.panTo(targetMarker.getLatLng(), { animate: true });
    } else {
        console.warn('نقطه‌ی مورد نظر برای هایلایت یافت نشد:', pointId);
    }

    return targetMarker;
}