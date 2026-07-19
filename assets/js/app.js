const map = L.map('map', {
    zoomControl: true,
    attributionControl: false
});

map.setView([32.4, 53.7], 5);

let provincesLayer;

fetch('data/iran-provinces.geojson')
    .then(response => response.json())
    .then(data => {

        provincesLayer = L.geoJSON(data, {

            style: provinceStyle,

            onEachFeature: onEachProvince

        }).addTo(map);

        map.fitBounds(provincesLayer.getBounds());

    });

function provinceStyle(feature){

    return {
        color: "#ffffff",
        weight: 2,
        fillColor: "#2E8B57",
        fillOpacity: 0.8
    }

}

function onEachProvince(feature, layer){

    layer.bindTooltip(`
        <b>${feature.properties.name}</b><br>
        تعداد رستوران: 0
    `);

    layer.on({

        mouseover: function(e){

            e.target.setStyle({
                fillColor:"#ff9800",
                fillOpacity:1
            });

        },

        mouseout: function(e){

            provincesLayer.resetStyle(e.target);

        }

    });

}