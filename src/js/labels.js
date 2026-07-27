const MIN_FONT_SIZE = 9;   
const MAX_FONT_SIZE = 46;  
const WIDTH_RATIO = 0.7;   
const HEIGHT_RATIO = 0.5; 
const FONT_WEIGHT = 700;

const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

function injectStylesOnce() {
    if (document.getElementById('map-name-label-style')) return;
    const style = document.createElement('style');
    style.id = 'map-name-label-style';
    style.textContent = `
        .map-name-label {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            pointer-events: none;
            user-select: none;
        }
        .map-name-label span {
            display: inline-block;
            white-space: nowrap;
            line-height: 1;
            font-weight: ${FONT_WEIGHT};
            color: rgba(0, 0, 0, 0.45);
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.75), 0 0 3px rgba(255, 255, 255, 0.75);
        }
    `;
    document.head.appendChild(style);
}

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

export function fitLabel(map, marker) {
    const el = marker.getElement();
    if (!el) return;
    const span = el.querySelector('span');
    if (!span) return;

    const { width, height } = getPixelSize(map, marker._boundPolygon.getBounds());
    const fontFamily = getComputedStyle(document.body).fontFamily || 'Tahoma, sans-serif';

    const fontSize = bestFontSize(marker._labelText, width * WIDTH_RATIO, height * HEIGHT_RATIO, fontFamily);

    if (fontSize < MIN_FONT_SIZE) {
        el.style.display = 'none';
    } else {
        el.style.display = 'flex';
        span.style.fontSize = `${fontSize}px`;
    }
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
    marker.on('add', () => fitLabel(map, marker));

    return marker;
}

export function refreshLabels(map, labelLayerGroup) {
    if (!labelLayerGroup) return;
    labelLayerGroup.eachLayer((marker) => fitLabel(map, marker));
}

injectStylesOnce();
