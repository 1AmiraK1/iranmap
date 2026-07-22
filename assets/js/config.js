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

export const styles = {
    province: { color: "#ffffff", weight: 1, fillColor: "#2E8B57", fillOpacity: 1, noClip: true },
    provinceHover: { fillColor: "#ff9800", fillOpacity: 1, sticky: true },
    
    county: { color: '#7f8c8d', weight: 1, dashArray: '4', fillColor: '#3498db', fillOpacity: 0.4, noClip: true },
    countyHover: { fillColor: "#e74c3c", fillOpacity: 0.9, sticky: true },

    sea: {color: '#999', weight: 1, fillColor: '#1989ec',fillOpacity: 1, noClip: true}
};