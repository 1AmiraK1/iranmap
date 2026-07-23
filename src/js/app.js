import { map, mapHandlers } from './map.js';
import { loadMapData } from './data.js';
import { initLayers } from './layers.js';
import { UI } from './ui.js';
import { states } from './config.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

loadMapData().then(data => {
    initLayers(map, data);
});

UI.setupEventListeners({
    onZoomIn: mapHandlers.zoomIn,
    onZoomOut: mapHandlers.zoomOut,
    onFitBounds: mapHandlers.fitBounds,
    onFullscreen: UI.toggleFullscreen,
    
    onBack: () => {
        UI.toggleBackButton(false);
        UI.fadeMap(() => {
            mapHandlers.resetToNationalBounds();
        });
    },

    onFullscreenChange: (isFullscreen) => {
        const title = isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه";
        UI.updateFullscreenTooltip(title);
        
        setTimeout(() => {
            const currentBounds = states.activeProvinceName && states.countyLayer && states.countyLayer.getLayers().length > 0
                ? states.countyLayer.getBounds() 
                : states.nationalBounds;
                
            mapHandlers.adjustMapAfterFullscreen(currentBounds);
        }, 200);
    }
});