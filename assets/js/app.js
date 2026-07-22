import { map } from './map.js';
import { states, mapConfig, styles } from './config.js';
import { onEachProvince } from './province.js';
import { onEachCounty } from './county.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

Promise.all([
    fetch('data/seas.geojson').then(res => res.json()),
    fetch('data/provinces.geojson').then(res => res.json()),
    fetch('data/counties.geojson').then(res => res.json())
]).then(([seasData, provincesData, countiesData]) => {
    
    states.seaLayer = L.geoJSON(seasData, {
        pane: 'seas',
        style: styles.sea
    }).addTo(map);

    states.provincesLayer = L.geoJSON(provincesData, {
        pane: 'provinces',
        style: styles.province,
        onEachFeature: onEachProvince
    }).addTo(map);

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
    const provincesBounds = states.provincesLayer.getBounds();

    const seasBounds = states.seaLayer.getBounds();
    states.nationalBounds = provincesBounds.extend(seasBounds);
    map.fitBounds(states.nationalBounds);
    map.setMaxBounds(states.nationalBounds);
    
    const baseZoom = map.getBoundsZoom(states.nationalBounds);
    map.setMinZoom(baseZoom);
    map.setMaxZoom(mapConfig.maxZoomForCountry);

}).catch(error => {
    console.error("خطا در بارگذاری فایل‌های GeoJSON:", error);
});