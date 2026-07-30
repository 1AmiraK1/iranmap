export let states = {
    provincesLayer: null,
    countyLayer: null,
    seaLayer: null,
    cityTileLayer: null,
    pointLayer:null,
    maskLayer: null,
    provinceLabelsLayer: null,
    countyLabelsLayer: null,
    countiesByProvince: {},
    activeProvinceCode: null,
    activeCountyName: null,
    activeCountyBounds: null,
    countyDataCache: null,
    nationalBounds: null,
}

export const disabledConfig = {
    provinces: [],
    counties: []
};

export function setDisabledConfig(data) {
    disabledConfig.provinces = (data && data.provinces) || [];
    disabledConfig.counties = (data && data.counties) || [];
};

export const isProvinceDisabled = (feature) =>
    disabledConfig.provinces.includes(feature.properties.shapeISO);

export const isCountyDisabled = (feature) =>
    disabledConfig.counties.some(c =>
        c.provinceCode === feature.properties.shapeISO &&
        c.name === feature.properties.shapeName
    );

export const mapConfig = {
    center: [32.4279, 53.6880],
    zoom: 5,
    maxZoomForCountry: 7,
    maxZoomForProvince: 10,
    maxZoomForCity: 13,
    boundsPadding: 0.1,
    tileNativeZoom: 12
};

const getCssVar = (varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

export const styles = {
    province: { color: getCssVar('--province-border'), weight: 1, fillColor: getCssVar('--province-fill'), fillOpacity: 1, noClip: true },
    provinceHover: { fillColor: getCssVar('--province-hover'), fillOpacity: 1, sticky: true },
    provinceDisabled: { color: getCssVar('--province-border'), weight: 1, fillColor: getCssVar('--province-disabled') || '#a9a9a9', fillOpacity: 1, noClip: true, interactive: false },
    county: { color: getCssVar('--county-border'), weight: 1, dashArray: '4', fillColor: getCssVar('--county-fill'), fillOpacity: 0.4, noClip: true },
    countyHover: { fillColor: getCssVar('--county-hover'), fillOpacity: 0.9, sticky: true },
    countyDisabled: { color: getCssVar('--county-border'), weight: 1, dashArray: '4', fillColor: getCssVar('--county-disabled') || '#a9a9a9', fillOpacity: 0.4, noClip: true, interactive: false },
    sea: { color: getCssVar('--sea-border'), weight: 1, fillColor: getCssVar('--sea-fill'), fillOpacity: 1, noClip: true },
    mask: { fillColor: '#000000', fillOpacity: 0.5, color: '#ff0000', weight: 2, interactive: false },
    point:{radius: 7, weight: 2, color: '#ffffff', fillColor: getCssVar('--poi-fill') || '#e63946', fillOpacity: 1}
};

export const computeMaxZoomFromMin = (minZoom, baseMaxZoom, buffer = 3) => {
    return Math.max(baseMaxZoom, minZoom + buffer);
};