import { states, mapConfig, styles, isCountyDisabled } from './config.js';
import { countyTooltipTemplate } from './templates.js';
import { map, fitAndConstrain } from './map.js';
import { UI } from './ui.js';
import { renderPointsForCounty } from './point.js';
import { updateCardsList } from './list.js';

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

export function navigateToCounty(feature, layer, options = {}) {
    const { onReady, skipListUpdate } = options;

    UI.showLoader('در حال بارگذاری شهر...');

    states.countyLayer.resetStyle(layer);
    const countyBounds = layer.getBounds();
    const targetCountyShapeId = feature.properties.shapeID;

    states.activeCountyName = feature.properties.shapeName;
    states.activeCountyShapeId = targetCountyShapeId;
    states.activeCountyBounds = countyBounds;
    if (!skipListUpdate) {
        updateCardsList(`/map/${states.activeProvinceCode}/${targetCountyShapeId}`);
    }
    renderPointsForCounty(map, targetCountyShapeId);
    UI.showCountyLabel(feature.properties.shapeName);

    fitAndConstrain(countyBounds, {
        animate: true,
        exactMaxZoom: mapConfig.maxZoomForCity,
        abortGuard: () => states.activeCountyShapeId !== targetCountyShapeId,
        onEnd: (cityMinZoom) => {
            const provinceCode = states.activeProvinceCode;
            const tileUrl = `/tiles/${encodeURIComponent(provinceCode)}/{z}/{x}/{y}.png`;

            let isTileLoaded = false;

            const finishTileLoading = () => {
                if (isTileLoaded) return;
                isTileLoaded = true;
                UI.hideLoader();
                if (states.activeCountyShapeId !== targetCountyShapeId) return;
                if (typeof onReady === 'function') onReady();
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
                states.cityTileLayer.off('tileerror');
                states.cityTileLayer.setUrl(tileUrl);
            }

            states.cityTileLayer.once('load', finishTileLoading);
            states.cityTileLayer.once('tileerror', finishTileLoading);

            if (!map.hasLayer(states.cityTileLayer)) {
                map.addLayer(states.cityTileLayer);
            }

            setTimeout(finishTileLoading, 400);
        }
    });

    requestAnimationFrame(() => {
        if (states.activeCountyShapeId !== targetCountyShapeId) return;

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
            style: styles.mask,
            renderer: L.canvas({ padding: 0.5 })
        }).addTo(map);
    });
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
        click: (e) => navigateToCounty(feature, layer)
    });
}