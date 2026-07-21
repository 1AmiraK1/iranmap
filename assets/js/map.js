import { mapConfig, states } from './config.js';

export const map = L.map('map', {
    zoomControl: false,
    attributionControl: false
});
map.setView(mapConfig.center, mapConfig.zoom);

document.getElementById("zoomIn").onclick = () => {
    map.zoomIn();
};

document.getElementById("zoomOut").onclick = () => {
    map.zoomOut();
};

const backBtn = document.getElementById("back");
backBtn.style.display = "none";

backBtn.onclick = () => {
    backBtn.style.display = "none";

    if (states.countyLayer) {
        states.countyLayer.clearLayers(); 
    }

    if (states.provincesLayer) map.addLayer(states.provincesLayer); 
    if (states.seaLayer) map.addLayer(states.seaLayer); 

    if (states.nationalBounds) {
        map.setMinZoom(0); 
        map.setMaxBounds(null); 
        
        map.fitBounds(states.nationalBounds, { 
            animate: false 
        });

        const baseZoom = map.getBoundsZoom(states.nationalBounds); 
        map.setMinZoom(baseZoom); 
        map.setMaxZoom(mapConfig.maxZoomForCountry); 
        map.setMaxBounds(states.nationalBounds); 
    }

    states.activeProvinceName = null; 
};