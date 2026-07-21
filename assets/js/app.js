import { map } from './map.js';
import { states, mapConfig, styles } from './config.js';
import { onEachProvince } from './province.js';
import { onEachCounty } from './county.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

fetch('data/seas.geojson')
    .then(res => res.json())
    .then(data => {
        states.seaLayer = L.geoJSON(data, {
            pane: 'seas',
            style: styles.sea
        }).addTo(map);
    });

fetch('data/provinces.geojson')
    .then(res => res.json())
    .then(data => {
        states.provincesLayer = L.geoJSON(data, {
            style: styles.province,
            onEachFeature: onEachProvince
        }).addTo(map); 
        states.nationalBounds = states.provincesLayer.getBounds();
        map.fitBounds(states.nationalBounds);
        map.setMaxBounds(states.nationalBounds);
        
        const baseZoom = map.getBoundsZoom(states.nationalBounds);
        map.setMinZoom(baseZoom);
        map.setMaxZoom(mapConfig.maxZoomForCountry);
    });

fetch('data/counties.geojson')
    .then(res => res.json())
    .then(data => {
        states.countyDataCache = data;
        states.countiesByProvince = {};

        for (const feature of data.features) {
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
    });