window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [2132537.9934561215, 7677514.481910748],
            zoom: 6
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'
    })

    //logi kliku w konsoli
    map.on('click', function(e){
        console.log(e);
    })

    //Vector Layers

    //wygląd punktów
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7
    })

    const seaportsGeoJSON = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector/seaports.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'seaports',
        style: new ol.style.Style({
            image: circleStyle
        })
    })

    map.addLayer(seaportsGeoJSON);

    //Vector Logic - kliknięcie na punkt
    map.on('click', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedFeatureName = feature.get('Port');
            let clickedFeatureCountry= feature.get('Kraj');
            console.log(clickedFeatureName, clickedFeatureCountry);
        })
    })
}