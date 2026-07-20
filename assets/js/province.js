import { map } from './map.js';
import { states, mapConfig, styles } from './config.js';
import { provinceTooltipTemplate } from './templates.js'; 

export function onEachProvince(feature, layer) {
    const tooltipHTML = provinceTooltipTemplate(feature.properties);
    layer.bindTooltip(tooltipHTML);
    layer.on({
        mouseover: (e) => {
            e.target.setStyle(styles.provinceHover);
        },
        mouseout: (e) => states.provincesLayer.resetStyle(e.target),
        click: (e) => {
            states.activeProvinceName = feature.properties.shapeISO;
            
            if (states.provincesLayer) map.removeLayer(states.provincesLayer);
            
            if (states.countyLayer && states.countyDataCache) {
                states.countyLayer.clearLayers();
                
                const filteredCounties = {
                type: "FeatureCollection",
                features: states.countiesByProvince[states.activeProvinceName] || []
                };

                states.countyLayer.addData(filteredCounties);
                
                map.addLayer(states.countyLayer);
            }
            const provinceBounds = e.target.getBounds();
            map.setMaxZoom(mapConfig.maxZoomForProvince); 
            map.fitBounds(provinceBounds, {
                animate: false,
            });
            const provinceMinZoom = map.getBoundsZoom(provinceBounds);
            map.setMinZoom(provinceMinZoom);
            map.setMaxBounds(provinceBounds);
        }
    });
}