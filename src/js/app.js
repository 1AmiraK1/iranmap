import { map, mapHandlers } from './map.js';
import { loadMapData } from './data.js';
import { initLayers } from './layers.js';
import { UI } from './ui.js';
import { states, setDisabledConfig } from './config.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

map.createPane('counties');
map.getPane('counties').style.zIndex = 450;

map.createPane('points');
map.getPane('points').style.zIndex = 500;

loadMapData().then(data => {
    UI.loadMapDataTimeout();
    if (!data.provincesData) {
        UI.showError('بارگذاری نقشه با خطا مواجه شد. لطفاً صفحه را رفرش کنید.');
        return;
    }
    setDisabledConfig(data.disabledData);
    initLayers(map, data);
});

UI.setupEventListeners({
    onZoomIn: mapHandlers.zoomIn,
    onZoomOut: mapHandlers.zoomOut,
    onFitBounds: mapHandlers.fitBounds,
    onFullscreen: UI.toggleFullscreen,

    onBack: () => {
        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            UI.fadeMap(() => {
                mapHandlers.resetToProvinceBounds();
            });
        } else {
            UI.toggleBackButton(false);
            UI.fadeMap(() => {
                mapHandlers.resetToNationalBounds();
            });
        }
    },

    onFullscreenChange: (isFullscreen) => {
        const title = isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه";
        const iconPath = isFullscreen ? "assets/image/svg/exit-fullscreen.svg" : "assets/image/svg/fullscreen.svg";
        UI.changeFullscreenIcon(iconPath);
        UI.updateFullscreenTooltip(title);

        UI.whenMapSizeStable(() => {
            let currentBounds;
            if (states.activeCountyName && states.activeCountyBounds) {
                currentBounds = states.activeCountyBounds;
            } else if (states.activeProvinceCode && states.countyLayer && states.countyLayer.getLayers().length > 0) {
                currentBounds = states.countyLayer.getBounds();
            } else {
                currentBounds = states.nationalBounds;
            }

            mapHandlers.adjustMapAfterFullscreen(currentBounds);
        });
    }
});