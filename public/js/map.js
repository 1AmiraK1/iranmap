import { mapConfig, states, computeMaxZoomFromMin } from './config.js';
import { UI } from './ui.js';
import { clearPoints, renderPointsForProvince, unpinActivePoint } from './point.js';
import { updateCardsList } from './list.js';

export const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    renderer: L.svg({ padding: 1.5 }),
    bounceAtZoomLimits: false,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    wheelDebounceTime: 10,
    scrollWheelZoom: true
});
map.setView(mapConfig.center, mapConfig.zoom);

map.on('click', () => unpinActivePoint());

export const mapHandlers = {
    zoomIn: () => map.zoomIn(),
    zoomOut: () => map.zoomOut(),

    fitBounds: () => {
        let currentBounds;
        if (states.activeCountyName && states.activeCountyBounds) {
            currentBounds = states.activeCountyBounds;
        } else if (states.activeProvinceCode && states.countyLayer) {
            currentBounds = states.countyLayer.getBounds();
        } else {
            currentBounds = states.nationalBounds;
        }

        if (currentBounds && currentBounds.isValid && currentBounds.isValid()) {
            map.flyToBounds(currentBounds, {
                duration: 0.25
            });
        }
    },

    resetToNationalBounds: () => {
        map.dragging.enable();
        updateCardsList('/');
        UI.hideCountyLabel();
        UI.hideLoader();
        if (states.countyLayer) states.countyLayer.clearLayers();
        if (states.provinceLabelsLayer && !map.hasLayer(states.provinceLabelsLayer)) {
            map.addLayer(states.provinceLabelsLayer);
        }
        if (states.countyLabelsLayer) {
            states.countyLabelsLayer.clearLayers();
            if (map.hasLayer(states.countyLabelsLayer)) {
                map.removeLayer(states.countyLabelsLayer);
            }
        }
        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            map.removeLayer(states.maskLayer);
        }
        states.maskLayer = null;
        if (states.cityTileLayer && map.hasLayer(states.cityTileLayer)) {
            map.removeLayer(states.cityTileLayer);
        }
        clearPoints(map);

        map.getPane('provinces').style.display = '';
        map.getPane('seas').style.display = '';

        if (states.nationalBounds) {
            fitAndConstrain(states.nationalBounds, {
                animate: false,
                exactMaxZoom: mapConfig.maxZoomForCountry
            });
        }
        states.activeProvinceCode = null;
        states.activeCountyName = null;
        states.activeCountyShapeId = null;
        states.activeCountyBounds = null;
    },

    resetToProvinceBounds: () => {
        map.dragging.enable();
        if (states.activeProvinceCode) {
            updateCardsList(`/map/${states.activeProvinceCode}`); 
        }
        UI.hideCountyLabel();
        UI.hideLoader();
        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            map.removeLayer(states.maskLayer);
        }
        states.maskLayer = null;
        if (states.cityTileLayer && map.hasLayer(states.cityTileLayer)) {
            map.removeLayer(states.cityTileLayer);
        }
        renderPointsForProvince(map, states.activeProvinceCode);

        if (states.countyLayer && !map.hasLayer(states.countyLayer)) {
            map.addLayer(states.countyLayer);
        }
        if (states.countyLabelsLayer && !map.hasLayer(states.countyLabelsLayer)) {
            map.addLayer(states.countyLabelsLayer);
        }

        if (states.countyLayer) {
            const provinceBounds = states.countyLayer.getBounds();
            fitAndConstrain(provinceBounds, {
                animate: false,
                baseMaxZoom: mapConfig.maxZoomForProvince
            });
        }

        states.activeCountyName = null;
        states.activeCountyShapeId = null;
        states.activeCountyBounds = null;
    },

    adjustMapAfterFullscreen: (currentBounds) => {
        map.invalidateSize();

        let options = { animate: false };
        if (states.activeCountyName) {
            options.exactMaxZoom = mapConfig.maxZoomForCity;
        } else if (states.activeProvinceCode) {
            options.baseMaxZoom = mapConfig.maxZoomForProvince;
        } else {
            options.exactMaxZoom = mapConfig.maxZoomForCountry;
        }

        fitAndConstrain(currentBounds, options);

    }
};

export function fitAndConstrain(bounds, options = {}) {
    const {
        animate = false,
        baseMaxZoom,
        exactMaxZoom,
        padding = mapConfig.boundsPadding,
        abortGuard,
        onEnd
    } = options;

    if (!bounds || typeof bounds.isValid !== 'function' || !bounds.isValid()) return null;

    map.setMinZoom(0);
    map.setMaxZoom(mapConfig.maxZoomForCity);
    map.setMaxBounds(null);

    const targetMinZoom = map.getBoundsZoom(bounds);

    let targetMaxZoom;
    if (exactMaxZoom !== undefined) {
        targetMaxZoom = Math.max(exactMaxZoom, targetMinZoom);
    } else if (baseMaxZoom !== undefined) {
        targetMaxZoom = computeMaxZoomFromMin(targetMinZoom, baseMaxZoom);
    } else {
        targetMaxZoom = targetMinZoom;
    }

    let constraintsApplied = false;
    const applyConstraints = () => {
        if (constraintsApplied) return;
        constraintsApplied = true;
        map.off('moveend', applyConstraints);
        if (typeof abortGuard === 'function' && abortGuard()) return;
        map.setMinZoom(targetMinZoom);
        map.setMaxZoom(targetMaxZoom);
        map.setMaxBounds(bounds.pad(padding));
        if (typeof onEnd === 'function') onEnd(targetMinZoom);
    };

    if (animate) {
        map.flyToBounds(bounds, { duration: 0.25 });
        map.once('moveend', applyConstraints);
        setTimeout(applyConstraints, 350);
    } else {
        map.fitBounds(bounds, { animate: false });
        applyConstraints();
    }

    return targetMinZoom;
}