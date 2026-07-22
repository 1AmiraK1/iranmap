import { mapConfig, states } from './config.js';

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
    
    document.getElementById('map').style.opacity = '0';
    document.getElementById('map').style.transition = 'opacity 0.4s ease';

    setTimeout(() => {
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

        document.getElementById('map').style.opacity = '1';
    }, 200); 
};


document.getElementById("fitBoundsBtn").onclick = () => {

    const currentBounds = states.activeProvinceName && states.countyLayer
        ? states.countyLayer.getBounds() 
        : states.nationalBounds;

    if (currentBounds) {
        map.flyToBounds(currentBounds, { 
            duration: 0.25,
            animate: false
        });
    }
};


const fsBtn = document.getElementById("fullscreenBtn");
fsBtn.onclick = () => {
    const mapElement = document.getElementById("map-wrapper"); 

    if (!document.fullscreenElement) {
        if (mapElement.requestFullscreen) {
            mapElement.requestFullscreen();
        } else if (mapElement.webkitRequestFullscreen) { 
            mapElement.webkitRequestFullscreen();
        } else if (mapElement.msRequestFullscreen) { 
            mapElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
};

function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.msFullscreenElement;

    if (isFullscreen) {
        fsBtn.setAttribute("data-title", "خروج از تمام صفحه");
    } else {
        fsBtn.setAttribute("data-title", "تمام صفحه");
    }

    setTimeout(() => {
        map.setMinZoom(0);
        map.setMaxBounds(null);

        map.invalidateSize(); 

        const currentBounds = states.activeProvinceName && states.countyLayer && states.countyLayer.getLayers().length > 0
            ? states.countyLayer.getBounds() 
            : states.nationalBounds;

        if (currentBounds && currentBounds.isValid()) {
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
    }, 200); 
}

document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange); 
document.addEventListener("msfullscreenchange", handleFullscreenChange); 