import { map } from './map.js';
import { states, mapConfig, styles } from './config.js';
import { countyTooltipTemplate } from './templates.js'; 

export function onEachCounty(feature, layer) {
    const tooltipHTML = countyTooltipTemplate(feature.properties);
    layer.bindTooltip(tooltipHTML);
    layer.on({
        mouseover: (e) => {
            e.target.setStyle(styles.countyHover);
        },
        mouseout: (e) => states.countyLayer.resetStyle(e.target)
    });
}
