import { mapConfig } from './config.js';

export const map = L.map('map', {
    zoomControl: true,
    attributionControl: false
});
map.setView(mapConfig.center, mapConfig.zoom);