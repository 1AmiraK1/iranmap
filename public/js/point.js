import { pointPanelTemplate } from './templates.js';
import { UI } from './ui.js';
import { states } from './config.js';

let allPoints = [];
let fetchedProvinces = new Set();
let pendingHighlightPointId = null;

const ICON_WIDTH = 26;
const ICON_HEIGHT = 34;

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

function pinMarker(marker) {
    marker._pinned = true;
    setMarkerActiveStyle(marker, true);
    states.activePointMarker = marker;
    UI.showPointPanel(pointPanelTemplate(marker._pointData), () => unpinMarker(marker));
}

function unpinMarker(marker) {
    marker._pinned = false;
    setMarkerActiveStyle(marker, false);
    if (states.activePointMarker === marker) {
        states.activePointMarker = null;
    }
    UI.hidePointPanel();
}

export function unpinActivePoint() {
    if (states.activePointMarker) {
        unpinMarker(states.activePointMarker);
    }
}

function renderPoints(map, points) {
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

export function clearPoints(map) {
    renderPoints(map, []);
}

export async function renderPointsForProvince(map, provinceCode) {
    if (!provinceCode) return;
    const targetProv = String(provinceCode);

    if (!fetchedProvinces.has(targetProv)) {
        UI.showLoader();
        try {
            const response = await fetch(`/map-points/${targetProv}`);
            if (response.ok) {
                const data = await response.json();

                const formattedPoints = data.filter(card => card.lat != null && card.lng != null).map(card => ({
                    id: String(card.id),
                    name: card.title,
                    address: card.address,
                    lat: Number(card.lat),
                    lng: Number(card.lng),
                    provinceCode: String(card.province_id),
                    countyShapeId: String(card.county_id ?? '')
                }));

                allPoints = [...allPoints, ...formattedPoints];
                fetchedProvinces.add(targetProv);
            }
        } catch (error) {
            console.error('خطا در دریافت نقاط استان (AJAX):', error);
        }
        UI.hideLoader();
    }
    const filtered = allPoints.filter(point => String(point.provinceCode) === targetProv);
    renderPoints(map, filtered);

    if (pendingHighlightPointId) {
        highlightPoint(map, pendingHighlightPointId);
        pendingHighlightPointId = null;
    }
}

export function renderPointsForCounty(map, countyShapeId) {
    const targetId = String(countyShapeId);
    const filtered = allPoints.filter(point => point.countyShapeId === targetId);
    renderPoints(map, filtered);
}

export function highlightPoint(map, pointId) {
    const targetId = String(pointId);

    if (!states.pointMarkers || !states.pointMarkers[targetId]) {
        pendingHighlightPointId = targetId;
        return null;
    }

    const targetMarker = states.pointMarkers[targetId];

    if (states.activePointMarker && states.activePointMarker !== targetMarker) {
        unpinMarker(states.activePointMarker);
    }

    if (targetMarker) {
        pinMarker(targetMarker);
        map.panTo(targetMarker.getLatLng(), { animate: true });
    }

    return targetMarker;
}