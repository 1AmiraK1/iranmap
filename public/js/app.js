import { map, mapHandlers } from './map.js';
import { loadMapData } from './data.js';
import { initLayers } from './layers.js';
import { UI } from './ui.js';
import { states, setDisabledConfig } from './config.js';
import {refreshLabels} from './labels.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

map.createPane('counties');
map.getPane('counties').style.zIndex = 450;

map.createPane('mask');
map.getPane('mask').style.zIndex = 460;

map.createPane('labels');
map.getPane('labels').style.zIndex=470;
map.getPane('labels').style.pointerEvents = 'none';

map.createPane('points');
map.getPane('points').style.zIndex = 500;

let labelRefreshTimer = null;
map.on('zoomend', () => {
    clearTimeout(labelRefreshTimer);
    labelRefreshTimer = setTimeout(() => {
        refreshLabels(map, states.provinceLabelsLayer);
        refreshLabels(map, states.countyLabelsLayer);
    }, 120);
});

loadMapData().then(data => {
    if (!data.provincesData) {
        UI.showError('بارگذاری نقشه با خطا مواجه شد. لطفاً صفحه را رفرش کنید.');
        return;
    }
    if (!data.seasData || !data.countiesData || !data.disabledData) {
        console.warn('برخی داده‌های نقشه بارگذاری نشدند:', data);
    }
    setDisabledConfig(data.disabledData);
    initLayers(map, data);
    setTimeout(() => UI.hideLoader(), 500);
    
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            refreshLabels(map, states.provinceLabelsLayer);
            refreshLabels(map, states.countyLabelsLayer);
        });
    }
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
        const iconPath = isFullscreen ? `/assets/image/svg/exit-fullscreen.svg` : `/assets/image/svg/fullscreen.svg`;
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