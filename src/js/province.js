import { map } from './map.js';
import { states, mapConfig, styles } from './config.js';
import { UI } from './ui.js';
import { provinceTooltipTemplate } from './templates.js';

export function onEachProvince(feature, layer) {
    const tooltipHTML = provinceTooltipTemplate(feature.properties);
    layer.bindTooltip(tooltipHTML,{
        sticky: true,    
        direction: 'top', 
        offset: [100, -10]
    });
    layer.on({
        mouseover: (e) => {
            e.target.setStyle(styles.provinceHover);
        },
        mouseout: (e) => states.provincesLayer.resetStyle(e.target),
        click: (e) => {
            states.provincesLayer.resetStyle(e.target)
            states.activeProvinceName = feature.properties.shapeISO;
            UI.toggleBackButton(true);
            map.getPane('provinces').style.display = 'none';
            map.getPane('seas').style.display = 'none';

            if (states.countyLayer && states.countyDataCache) {
                states.countyLayer.clearLayers();

                const filteredCounties = {
                    type: "FeatureCollection",
                    features: states.countiesByProvince[states.activeProvinceName] || []
                };

                states.countyLayer.addData(filteredCounties);
            }

            const provinceBounds = e.target.getBounds();
            map.setMinZoom(0);
            map.setMaxBounds(null);

            map.flyToBounds(provinceBounds, {
                duration: 0.15 
            });

            map.once('moveend', () => {
                map.setMaxZoom(mapConfig.maxZoomForProvince);
                const provinceMinZoom = map.getBoundsZoom(provinceBounds);
                map.setMinZoom(provinceMinZoom);
                map.setMaxBounds(provinceBounds);
            });
        }
    });
}