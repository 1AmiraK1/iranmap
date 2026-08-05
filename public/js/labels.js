const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;
const WIDTH_RATIO = 0.85;
const HEIGHT_RATIO = 0.6;
const FONT_WEIGHT = 700;

const CUSTOM_OFFSETS = {
    'هرمزگان': [0.6, -0.1],   
    'بوشهر': [0.0, 0.1],  
    'مرکزی': [0.0, -0.3],  
    'تهران': [0.0, -0.2],  
    'Karaj': [0.0, -0.05],  
    'آذربایجان غربی': [0.1, -0.3],  
};

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
    let center;
    if (typeof polygonLayer.getCenter === 'function') {
        center = polygonLayer.getCenter();
    } else {
        center = polygonLayer.getBounds().getCenter();
    }

    if (center && polygonLayer.feature && polygonLayer.feature.properties) {
        const provinceName = polygonLayer.feature.properties.shapeName;
        
        if (CUSTOM_OFFSETS[provinceName]) {
            return L.latLng(
                center.lat + CUSTOM_OFFSETS[provinceName][0],
                center.lng + CUSTOM_OFFSETS[provinceName][1]
            );
        }
    }

    return center;
}

let cachedFontFamily = null;
function getLabelFontFamily() {
    if (cachedFontFamily === null) {
        cachedFontFamily = getComputedStyle(document.body).fontFamily || 'Tahoma, sans-serif';
    }
    return cachedFontFamily;
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