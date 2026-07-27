import { states, mapConfig, styles, isProvinceDisabled, isCountyDisabled } from './config.js';
import { onEachProvince } from './province.js';
import { onEachCounty } from './county.js';
import { createNameLabel } from './labels.js';

export const initLayers = (map, { seasData, provincesData, countiesData }) => {
    if (seasData) {
        states.seaLayer = L.geoJSON(seasData, {
            pane: 'seas',
            style: styles.sea
        }).addTo(map);
    }

    if (provincesData) {
        states.provincesLayer = L.geoJSON(provincesData, {
            pane: 'provinces',
            style: (feature)=> isProvinceDisabled(feature)? styles.provinceDisabled: styles.province,
            onEachFeature: onEachProvince
        }).addTo(map);

        states.provinceLabelsLayer = L.layerGroup();
        states.provincesLayer.eachLayer((layer) => {
            const marker = createNameLabel(map, layer, layer.feature.properties.shapeName, 'province-name-label');
            states.provinceLabelsLayer.addLayer(marker);
        });
        states.provinceLabelsLayer.addTo(map);
        
        let nationalBounds = states.provincesLayer.getBounds();
        if (states.seaLayer) nationalBounds = nationalBounds.extend(states.seaLayer.getBounds());

        states.nationalBounds = nationalBounds;
        map.fitBounds(states.nationalBounds);
        map.setMaxBounds(states.nationalBounds);

        const baseZoom = map.getBoundsZoom(states.nationalBounds);
        map.setMinZoom(baseZoom);
        map.setMaxZoom(mapConfig.maxZoomForCountry);
    }

    states.countyLayer = L.geoJSON(null, {
        pane: 'counties',
        style: (feature)=> isCountyDisabled(feature)? styles.countyDisabled: styles.county,
        onEachFeature: onEachCounty,
    });
    map.addLayer(states.countyLayer);

    if (countiesData) {
        states.countyDataCache = countiesData;
        states.countiesByProvince = {};
        for (const feature of countiesData.features) {
            const key = feature.properties.shapeISO;
            (states.countiesByProvince[key] ??= []).push(feature);
        }
    }
};