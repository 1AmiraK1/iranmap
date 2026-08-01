import { states, mapConfig, styles, isCountyDisabled } from './config.js';
import { countyTooltipTemplate } from './templates.js';
import { map } from './map.js';
import {renderCountyPoints} from './point.js';
import { UI } from './ui.js'; 

function createMaskFeature(feature) {
    const outerRing = [
        [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]
    ];

    const holes = [];
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
        holes.push(geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => holes.push(polygon[0]));
    }

    return {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [outerRing, ...holes]
        }
    };
}

export function onEachCounty(feature, layer) {
    if (isCountyDisabled(feature)) {
        return;
    }

    const tooltipHTML = countyTooltipTemplate(feature.properties);
    layer.bindTooltip(tooltipHTML, {
        sticky: true,
        direction: 'top',
        offset: [100, -10]
    });
    layer.on({
        mouseover: (e) => {
            e.target.setStyle(styles.countyHover);
        },
        mouseout: (e) => states.countyLayer.resetStyle(e.target),
        click: (e) => {
            UI.showLoader('در حال بارگذاری شهر...');

            states.countyLayer.resetStyle(e.target);
            const countyBounds = e.target.getBounds();
            states.activeCountyName = feature.properties.shapeName;
            states.activeCountyBounds = countyBounds;
            UI.showCountyLabel(feature.properties.shapeName);
            renderCountyPoints(map, states, feature.properties.shapeName);

            map.setMinZoom(0);
            map.setMaxZoom(mapConfig.maxZoomForCity);
            map.setMaxBounds(null);

            map.flyToBounds(countyBounds, {
                duration: 0.25
            });

            requestAnimationFrame(() => {
                if (states.activeCountyName !== feature.properties.shapeName) return;

                map.removeLayer(states.countyLayer);
                if (states.countyLabelsLayer && map.hasLayer(states.countyLabelsLayer)) {
                    map.removeLayer(states.countyLabelsLayer);
                }
                if (states.maskLayer && map.hasLayer(states.maskLayer)) {
                    map.removeLayer(states.maskLayer);
                }
                const maskGeoJSON = createMaskFeature(feature);
                states.maskLayer = L.geoJSON(maskGeoJSON, {
                    pane: 'mask',
                    style: styles.mask
                }).addTo(map);
            });

            map.once('moveend', () => {
                if (states.activeCountyName !== feature.properties.shapeName) return;
                const cityMinZoom = map.getBoundsZoom(countyBounds);
                map.setMinZoom(cityMinZoom);
                map.setMaxBounds(countyBounds.pad(mapConfig.boundsPadding));

                const provinceCode = states.activeProvinceCode;
                const tileUrl = `php/tiles.php?z={z}&x={x}&y={y}&province=${encodeURIComponent(provinceCode)}`;
                const targetCountyName = feature.properties.shapeName;

                const finishTileLoading = () => {
                    if (states.activeCountyName !== targetCountyName) return;
                    UI.hideLoader();
                };

                if (!states.cityTileLayer) {
                    states.cityTileLayer = L.tileLayer(tileUrl, {
                        maxZoom: mapConfig.maxZoomForCity,
                        minNativeZoom: mapConfig.tileNativeZoom,
                        maxNativeZoom: mapConfig.tileNativeZoom,
                        className: 'city-tiles'
                    });
                } else {
                    states.cityTileLayer.off('load');
                    states.cityTileLayer.setUrl(tileUrl);
                }

                states.cityTileLayer.once('load', finishTileLoading);

                if (!map.hasLayer(states.cityTileLayer)) {
                    map.addLayer(states.cityTileLayer);
                }

                setTimeout(() => {
                    if (states.cityTileLayer._loading === false) {
                        finishTileLoading();
                    }
                }, 0);
            });
        }
    });
}