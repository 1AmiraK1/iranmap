import { map } from './map.js';
import { states, mapConfig, styles, computeMaxZoomFromMin, isProvinceDisabled } from './config.js';
import { UI } from './ui.js';
import { provinceTooltipTemplate } from './templates.js';

export function onEachProvince(feature, layer) {
    if (isProvinceDisabled(feature)) {
        return;
    }

    const tooltipHTML = provinceTooltipTemplate(feature.properties);
    layer.bindTooltip(tooltipHTML, {
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
            states.provincesLayer.resetStyle(e.target);
            states.activeProvinceCode = feature.properties.shapeISO;

            UI.toggleBackButton(true);
            map.getPane('provinces').style.display = 'none';
            map.getPane('seas').style.display = 'none';

            if (states.countyLayer && states.countyDataCache) {
                states.countyLayer.clearLayers();
                const filteredCounties = {
                    type: "FeatureCollection",
                    features: states.countiesByProvince[states.activeProvinceCode] || []
                };
                states.countyLayer.addData(filteredCounties);
            }

            let targetBounds = states.countyLayer.getBounds();

            if (!targetBounds.isValid()) {
                targetBounds = e.target.getBounds();
            }

            map.invalidateSize({ debounceMoveend: true });

            map.setMinZoom(0);
            map.setMaxZoom(mapConfig.maxZoomForCity);
            map.setMaxBounds(null);

            if (targetBounds.isValid()) {
                map.flyToBounds(targetBounds, { duration: 0.25 });

                map.once('moveend', () => {
                    if (states.activeProvinceCode !== feature.properties.shapeISO) return;

                    const idealMinZoom = map.getBoundsZoom(targetBounds);
                    const calculatedMaxZoom = computeMaxZoomFromMin(idealMinZoom, mapConfig.maxZoomForProvince);

                    map.setMinZoom(idealMinZoom);
                    map.setMaxZoom(calculatedMaxZoom);
                    map.setMaxBounds(targetBounds.pad(mapConfig.boundsPadding));
                });
            }
        },
    })
}