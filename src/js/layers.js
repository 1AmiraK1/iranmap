import { states, mapConfig, styles } from './config.js';
import { onEachProvince } from './province.js';
import { onEachCounty } from './county.js';

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
            style: styles.province,
            onEachFeature: onEachProvince
        }).addTo(map);
        
        let nationalBounds = states.provincesLayer.getBounds();
        if (states.seaLayer) nationalBounds = nationalBounds.extend(states.seaLayer.getBounds());
        
        states.nationalBounds = nationalBounds;
        map.fitBounds(states.nationalBounds);
        map.setMaxBounds(states.nationalBounds);
        
        const baseZoom = map.getBoundsZoom(states.nationalBounds);
        map.setMinZoom(baseZoom);
        map.setMaxZoom(mapConfig.maxZoomForCountry);
    }

    if (countiesData) {
        states.countyDataCache = countiesData;
        states.countiesByProvince = {};
        
        for (const feature of countiesData.features) {
            const key = feature.properties.shapeISO;
            if (!states.countiesByProvince[key]) {
                states.countiesByProvince[key] = [];
            }
            states.countiesByProvince[key].push(feature);
        }
        
        states.countyLayer = L.geoJSON(null, {
            style: styles.county,
            onEachFeature: onEachCounty,
        });
        map.addLayer(states.countyLayer);
    }
};