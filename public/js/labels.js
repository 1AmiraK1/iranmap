const MIN_FONT_SIZE = 5;   
const MAX_FONT_SIZE = 46;  
const WIDTH_RATIO = 0.5;   
const HEIGHT_RATIO = 0.5; 
const FONT_WEIGHT = 400;

const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

export const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

function measureTextWidth(text, fontSize, fontFamily) {
    measureCtx.font = `${FONT_WEIGHT} ${fontSize}px ${fontFamily}`;
    return measureCtx.measureText(text).width;
}

function bestFontSize(text, maxWidth, maxHeight, fontFamily) {
    let lo = MIN_FONT_SIZE;
    let hi = Math.min(MAX_FONT_SIZE, Math.floor(maxHeight));
    if (hi < lo || maxWidth <= 0) return 0;

    let best = 0;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (measureTextWidth(text, mid, fontFamily) <= maxWidth) {
            best = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return best;
}

function getPixelSize(map, bounds) {
    const nw = map.latLngToLayerPoint(bounds.getNorthWest());
    const se = map.latLngToLayerPoint(bounds.getSouthEast());
    return {
        width: Math.abs(se.x - nw.x),
        height: Math.abs(se.y - nw.y)
    };
}

function getShapeCenter(polygonLayer) {
    if (typeof polygonLayer.getCenter === 'function') {
        const center = polygonLayer.getCenter();
        if (center) return center;
    }
    return polygonLayer.getBounds().getCenter();
}

let cachedFontFamily = null;
function getLabelFontFamily() {
    if (cachedFontFamily === null) {
        cachedFontFamily = getComputedStyle(document.body).fontFamily || 'Tahoma, sans-serif';
    }
    return cachedFontFamily;
}

export function fitLabel(map, marker) {
    const el = marker.getElement();
    if (!el) return;
    const span = el.querySelector('span');
    if (!span) return;

    const { width, height } = getPixelSize(map, marker._boundPolygon.getBounds());
    const fontFamily = getLabelFontFamily();

    let fontSize = bestFontSize(marker._labelText, width * WIDTH_RATIO, height * HEIGHT_RATIO, fontFamily);
    if (fontSize < MIN_FONT_SIZE) fontSize = MIN_FONT_SIZE;

    el.style.display = 'flex';
    span.style.fontSize = `${fontSize}px`;
}

export function createNameLabel(map, polygonLayer, name, className = '') {
    const marker = L.marker(getShapeCenter(polygonLayer), {
        pane: 'labels',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
            className: `map-name-label ${className}`.trim(),
            html: `<span>${escapeHtml(name)}</span>`,
            iconSize: [0, 0]
        })
    });

    marker._boundPolygon = polygonLayer;
    marker._labelText = name;

    return marker;
}

export function refreshLabels(map, labelLayerGroup) {
    if (!labelLayerGroup) return;

    const fontFamily = getLabelFontFamily();
    const pendingWrites = [];

    labelLayerGroup.eachLayer((marker) => {
        const el = marker.getElement();
        if (!el) return;
        const span = el.querySelector('span');
        if (!span) return;

        const { width, height } = getPixelSize(map, marker._boundPolygon.getBounds());
        let fontSize = bestFontSize(marker._labelText, width * WIDTH_RATIO, height * HEIGHT_RATIO, fontFamily);
        if (fontSize < MIN_FONT_SIZE) fontSize = MIN_FONT_SIZE;

        pendingWrites.push({ el, span, fontSize });
    });

    pendingWrites.forEach(({ el, span, fontSize }) => {
        el.style.display = 'flex';
        span.style.fontSize = `${fontSize}px`;
    });
}