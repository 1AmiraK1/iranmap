export let states = {
    provincesLayer: null,
    countyLayer: null,
    seaLayer: null,
    countiesByProvince: {},
    activeProvinceName : null, 
    countyDataCache : null,
    nationalBounds : null,
    dynamicZoomThreshold : null,
}

export const mapConfig = {
    center: [32.4279, 53.6880],
    maxZoomForCountry: 7, 
    maxZoomForProvince: 10
};

const getCssVar = (varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

export const styles = {
    province: { color: getCssVar('--province-border'), weight: 1, fillColor: getCssVar('--province-fill'), fillOpacity: 1, noClip: true },
    provinceHover: { fillColor: getCssVar('--province-hover'), fillOpacity: 1, sticky: true },
    county: { color: getCssVar('--county-border'), weight: 1, dashArray: '4', fillColor: getCssVar('--county-fill'), fillOpacity: 0.4, noClip: true },
    countyHover: { fillColor: getCssVar('--county-hover'), fillOpacity: 0.9, sticky: true },
    sea: { color: getCssVar('--sea-border'), weight: 1, fillColor: getCssVar('--sea-fill'), fillOpacity: 1, noClip: true }
};