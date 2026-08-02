import { navigateToProvince } from './province.js';
import { navigateToCounty } from './county.js';
import { highlightPoint } from './point.js';

function findLayerByProperty(layerGroup, propName, value) {
    if (!layerGroup || value == null) return null;
    let found = null;
    layerGroup.eachLayer((layer) => {
        if (found || !layer.feature) return;
        if (String(layer.feature.properties[propName]) === String(value)) {
            found = layer;
        }
    });
    return found;
}

export function applyInitialRoute(map, states) {
    const initial = window.initialMapState;
    if (!initial || !initial.provinceCode) {
        return { entered: false, enteredCounty: false };
    }

    const provinceLayer = findLayerByProperty(states.provincesLayer, 'shapeISO', initial.provinceCode);
    if (!provinceLayer) {
        console.warn('استان مورد نظر در URL یافت نشد:', initial.provinceCode);
        return { entered: false, enteredCounty: false };
    }

    navigateToProvince(provinceLayer.feature, provinceLayer);

    if (!initial.countyShapeId) {
        return { entered: true, enteredCounty: false };
    }

    const countyLayer = findLayerByProperty(states.countyLayer, 'shapeID', initial.countyShapeId);
    if (!countyLayer) {
        console.warn('شهرستان مورد نظر در URL یافت نشد:', initial.countyShapeId);
        return { entered: true, enteredCounty: false };
    }

    navigateToCounty(countyLayer.feature, countyLayer, {
        onReady: () => {
            if (initial.pointId) {
                highlightPoint(map, states, initial.pointId);
            }
        }
    });

    return { entered: true, enteredCounty: true };
}