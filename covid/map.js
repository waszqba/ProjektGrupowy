window.onload = init;

var seaportsGeoJSON;
var routeLayer;
var map;

function init(){
    map = new ol.Map({
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
        console.log(e.coordinate);
    })

    //Vector Layers

    //wygląd punktów
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7
    })

    seaportsGeoJSON = new ol.layer.VectorImage({
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
         //   console.log(clickedFeatureName, clickedFeatureCountry);
         //   drawRoute(clickedFeatureName);
        // drawRoute('Gdansk', 'Nynashamn');
        })
    })
}

function drawRoute(portName1, portName2)
{
    var vectorSource = seaportsGeoJSON.getSource();
    var features = vectorSource.getFeatures();
    var port1Coordinates, port2Coordinates;
    for (var i = 0, ii = features.length; i < ii; i++) {
      if (features[i].get('Port') === portName1) {
        port1Coordinates = features[i].get('geometry').flatCoordinates;
        break;
      }
    }
    for (var i = 0, ii = features.length; i < ii; i++) {
        if (features[i].get('Port') === portName2) {
          port2Coordinates = features[i].get('geometry').flatCoordinates;
          break;
        }
      }
 //   console.log(port1Coordinates);
  //  console.log(port2Coordinates);

var points = [];
points.push(port1Coordinates);
points.push(port2Coordinates);

    //var points = [ [2559362.3594005457, 8163042.485578188], [2984963.732892407, 7737441.112086326] ];
    /*for (var i = 0; i < points.length; i++) {
        points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
    }*/
//points.push([2862664.487636125, 7365651.4065072285]);

    var featureLine = new ol.Feature({
        geometry: new ol.geom.LineString(points)
    });

    var vectorLine = new ol.source.Vector({});
vectorLine.addFeature(featureLine);

var vectorLineLayer = new ol.layer.Vector({
    source: vectorLine,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#ff70f5', width: 4 })
    })
});

map.addLayer(vectorLineLayer);
}
