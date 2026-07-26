import { styles } from "./config.js";

export const pointData= {
    'گناوه':[
        { name: 'بندر گناوه', lat: 29.5807, lng: 50.5124 },
        { name: 'میدان امام گناوه', lat: 29.5790, lng: 50.5203 },
        { name: 'ساحل گناوه', lat: 29.578, lng: 50.510 }
    ]
};

export function renderCountyPoints(map, states, countyName){
    clearCountyPoints(map, states);

    const points = pointData[countyName];
    if (!points || points.length === 0) return;

    // const markers = points.map(p =>
    //     L.circleMarker([p.lat, p.lng],{
    //         pane:'points',
    //         ...styles.point
    //     }).bindPopup(p.name)
    //     );

    const markers = points.map(p =>
        L.marker([p.lat, p.lng],
                { pane: 'points' })
                .bindPopup(p.name)
    );

        states.pointlayer = L.layerGroup(markers).addTo(map);
}

export function clearCountyPoints(map, states){
    if (states.pointlayer && map.hasLayer(states.pointlayer)) {
        map.removeLayer(states.pointlayer);
    }
    states.pointlayer = null;
}