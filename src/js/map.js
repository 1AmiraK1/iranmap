import { mapConfig, states, computeMaxZoomFromMin } from './config.js';
import { clearCountyPoints } from './point.js';

export const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    renderer: L.svg({ padding: 15 }),
    bounceAtZoomLimits: false,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    wheelDebounceTime: 10,
    scrollWheelZoom: true
});
map.setView(mapConfig.center, mapConfig.zoom);

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
        if (states.countyLayer) states.countyLayer.clearLayers();
        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            map.removeLayer(states.maskLayer);
        }
        states.maskLayer = null;
        if (states.cityTileLayer && map.hasLayer(states.cityTileLayer)) {
            map.removeLayer(states.cityTileLayer);
        }
        clearCountyPoints(map, states);

        map.getPane('provinces').style.display = '';
        map.getPane('seas').style.display = '';

        if (states.nationalBounds) {
            map.setMinZoom(0);
            map.setMaxBounds(null);
            map.fitBounds(states.nationalBounds, { animate: false });

            const baseZoom = map.getBoundsZoom(states.nationalBounds);
            map.setMinZoom(baseZoom);
            map.setMaxZoom(mapConfig.maxZoomForCountry);
            map.setMaxBounds(states.nationalBounds.pad(mapConfig.boundsPadding));
        }
        states.activeProvinceCode = null;
        states.activeCountyName = null;
        states.activeCountyBounds = null;
    },

    resetToProvinceBounds: () => {
        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            map.removeLayer(states.maskLayer);
        }
        states.maskLayer = null;
        if (states.cityTileLayer && map.hasLayer(states.cityTileLayer)) {
            map.removeLayer(states.cityTileLayer);
        }
        clearCountyPoints(map, states);

        if (states.countyLayer && !map.hasLayer(states.countyLayer)) {
            map.addLayer(states.countyLayer);
        }

        if (states.countyLayer) {
            const provinceBounds = states.countyLayer.getBounds();

            if (provinceBounds && provinceBounds.isValid && provinceBounds.isValid()) {
                map.setMinZoom(0);
                map.setMaxBounds(null);

                map.fitBounds(provinceBounds, { animate: false });

                const newMinZoom = map.getBoundsZoom(provinceBounds);
                map.setMinZoom(newMinZoom);

                const calculatedMaxZoom = computeMaxZoomFromMin(newMinZoom, mapConfig.maxZoomForProvince);
                map.setMaxZoom(calculatedMaxZoom);

                map.setMaxBounds(provinceBounds.pad(mapConfig.boundsPadding));
            }
        }

        states.activeCountyName = null;
        states.activeCountyBounds = null;
    },

    adjustMapAfterFullscreen: (currentBounds) => {
        map.invalidateSize();

        if (!(currentBounds && currentBounds.isValid && currentBounds.isValid())) {
            return;
        }

        map.setMinZoom(0);
        map.setMaxZoom(mapConfig.maxZoomForCity);
        map.setMaxBounds(null);

        map.fitBounds(currentBounds, { animate: false });

        const newMinZoom = map.getBoundsZoom(currentBounds);

        map.setMinZoom(newMinZoom);

        let targetMaxZoom;
        if (states.activeCountyName) {
            targetMaxZoom = mapConfig.maxZoomForCity;
        } else if (states.activeProvinceCode) {
            targetMaxZoom = computeMaxZoomFromMin(newMinZoom, mapConfig.maxZoomForProvince);
        } else {
            targetMaxZoom = Math.max(mapConfig.maxZoomForCountry, newMinZoom);
        }
        map.setMaxZoom(targetMaxZoom);
        map.setMaxBounds(currentBounds.pad(mapConfig.boundsPadding));

    }
};