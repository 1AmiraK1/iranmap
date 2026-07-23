import { mapConfig, states } from './config.js';
import { UI } from './ui.js';

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
        const currentBounds = states.activeProvinceName && states.countyLayer
            ? states.countyLayer.getBounds() 
            : states.nationalBounds;

        if (currentBounds && currentBounds.isValid && currentBounds.isValid()) {
            map.flyToBounds(currentBounds, { 
                duration: 0.25,
                animate: false
            });
        }
    },

    resetToNationalBounds: () => {
        if (states.countyLayer) states.countyLayer.clearLayers(); 
        map.getPane('provinces').style.display = '';
        map.getPane('seas').style.display = '';

        if (states.nationalBounds) {
            map.setMinZoom(0); 
            map.setMaxBounds(null); 
            map.fitBounds(states.nationalBounds, { animate: false });

            const baseZoom = map.getBoundsZoom(states.nationalBounds); 
            map.setMinZoom(baseZoom); 
            map.setMaxZoom(mapConfig.maxZoomForCountry); 
            map.setMaxBounds(states.nationalBounds); 
        }
        states.activeProvinceName = null; 
    },

    adjustMapAfterFullscreen: (currentBounds) => {
        map.setMinZoom(0);
        map.setMaxBounds(null);
        map.invalidateSize(); 

        if (currentBounds && currentBounds.isValid && currentBounds.isValid()) {
            map.fitBounds(currentBounds, { animate: false });

            const newMinZoom = map.getBoundsZoom(currentBounds);
            map.setMinZoom(newMinZoom);
            map.setMaxBounds(currentBounds);

            if (states.activeProvinceName) {
                map.setMaxZoom(mapConfig.maxZoomForProvince);
            } else {
                map.setMaxZoom(mapConfig.maxZoomForCountry);
            }
        }
    }
};