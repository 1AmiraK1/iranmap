import { navigateToProvince } from './province.js';
import { navigateToCounty } from './county.js';
import { highlightPoint, unpinActivePoint } from './point.js';
import { mapHandlers } from './map.js';
import { states } from './config.js';

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

function sameId(a, b) {
    return a != null && b != null && String(a) === String(b);
}

export async function applyInitialRoute(map, initialMapState) {
    const initial = initialMapState;
    if (!initial || !initial.provinceCode) {
        return { entered: false, enteredCounty: false };
    }

    const alreadyInProvince = sameId(states.activeProvinceCode, initial.provinceCode);

    if (!alreadyInProvince) {
        const provinceLayer = findLayerByProperty(states.provincesLayer, 'shapeISO', initial.provinceCode);
        if (!provinceLayer) {
            console.warn('استان مورد نظر در URL یافت نشد:', initial.provinceCode);
            return { entered: false, enteredCounty: false };
        }
        await navigateToProvince(provinceLayer.feature, provinceLayer);
    }

    if (!initial.countyShapeId) {
        if (alreadyInProvince && states.activeCountyShapeId) {
            mapHandlers.resetToProvinceBounds();
        }
        return { entered: true, enteredCounty: false };
    }

    const alreadyInCounty = alreadyInProvince && sameId(states.activeCountyShapeId, initial.countyShapeId);

    if (alreadyInCounty) {
        if (initial.pointId) {
            highlightPoint(map, initial.pointId);
        } else {
            unpinActivePoint();
        }
        return { entered: true, enteredCounty: true };
    }

    const countyLayer = findLayerByProperty(states.countyLayer, 'shapeID', initial.countyShapeId);
    if (!countyLayer) {
        console.warn('شهرستان مورد نظر در URL یافت نشد:', initial.countyShapeId);
        return { entered: true, enteredCounty: false };
    }

    navigateToCounty(countyLayer.feature, countyLayer, {
        onReady: () => {
            if (initial.pointId) {
                highlightPoint(map, initial.pointId);
            }
        }
    });

    return { entered: true, enteredCounty: true };
}