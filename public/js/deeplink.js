import { navigateToProvince } from './province.js';
import { navigateToCounty } from './county.js';
import { highlightPoint } from './point.js';
import { states } from './config.js';

export function findLayerByProperty(layerGroup, propName, value) {
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

export async function navigateToPoint(map, { provinceCode, countyShapeId, pointId, skipListUpdate = false } = {}) {
    if (!provinceCode) {
        return { entered: false, enteredCounty: false };
    }

    if (states.activeProvinceCode !== provinceCode) {
        const provinceLayer = findLayerByProperty(states.provincesLayer, 'shapeISO', provinceCode);
        if (!provinceLayer) {
            console.warn('استان مورد نظر یافت نشد:', provinceCode);
            return { entered: false, enteredCounty: false };
        }
        await navigateToProvince(provinceLayer.feature, provinceLayer, { skipListUpdate: true });
    }

    if (!countyShapeId) {
        if (pointId) highlightPoint(map, pointId);
        return { entered: true, enteredCounty: false };
    }

    if (states.activeCountyShapeId !== countyShapeId) {
        const countyLayer = findLayerByProperty(states.countyLayer, 'shapeID', countyShapeId);
        if (!countyLayer) {
            console.warn('شهرستان مورد نظر یافت نشد:', countyShapeId);
            if (pointId) highlightPoint(map, pointId);
            return { entered: true, enteredCounty: false };
        }

        await navigateToCounty(countyLayer.feature, countyLayer, {
            skipListUpdate,
            onReady: () => {
                if (pointId) highlightPoint(map, pointId);
            }
        });

        return { entered: true, enteredCounty: true };
    }

    if (pointId) highlightPoint(map, pointId);
    return { entered: true, enteredCounty: true };
}

export async function applyInitialRoute(map, initialMapState) {
    if (!initialMapState || !initialMapState.provinceCode) {
        return { entered: false, enteredCounty: false };
    }
    return navigateToPoint(map, {
        provinceCode: initialMapState.provinceCode,
        countyShapeId: initialMapState.countyShapeId,
        pointId: initialMapState.pointId,
        skipListUpdate: true
    });
}