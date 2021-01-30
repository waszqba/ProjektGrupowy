<template>
  <div class="map-container"
       ref="mapRoot" />
</template>

<script lang="ts">
import Vue from 'vue';
import {
  View, Map, MapBrowserEvent, Feature,
} from 'ol';
import { Tile as TileLayer, VectorImage, Vector as VectorLayer } from 'ol/layer';
import {
  Circle, Fill, Style, Stroke,
} from 'ol/style';
import { OSM, Vector } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { LineString } from 'ol/geom';

import {
  Component, Emit, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  name: 'MapContainer',
})
export default class MapContainer extends Vue {
  @Prop({ type: Object, default: null })
  geojson!: object;

  @Prop({ type: Array, default: null })
  coordinates!: number[][];

  layerLines?: VectorLayer;

  seaportsGeoJSON!: VectorImage;

  $refs!: {
    mapRoot: HTMLElement;
  }

  map!: Map;

  mounted() {
    const circleStyle = new Circle({
      fill: new Fill({
        color: [245, 49, 5, 1],
      }),
      radius: 7,
    });

    this.seaportsGeoJSON = new VectorImage({
      source: new Vector({
        features: new GeoJSON({
          featureProjection: 'EPSG:3857',
        }).readFeatures(this.geojson),
      }),
      visible: true,
      style: new Style({
        image: circleStyle,
      }),
    });
    // this is where we create the OpenLayers map
    this.map = new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs.mapRoot,
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM(), // tiles are served by OpenStreetMap
        }),
        this.seaportsGeoJSON,
      ],

      // the map view will initially show the whole world
      view: new View({
        center: [2132537.9934561215, 7677514.481910748],
        zoom: 6,
        constrainResolution: true,
      }),
    });

    this.map.on('click', this.click);
  }

  private drawLine(coordinates: number[][]): void {
    if (this.layerLines) {
      this.map.removeLayer(this.layerLines);
    }
    const vector = new Vector({
      features: [
        new Feature({
          geometry: new LineString(coordinates.map((coord) => fromLonLat(coord))),
          name: 'Line',
        }),
      ],
    });
    this.layerLines = new VectorLayer({
      source: vector,
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 3,
        }),
      }),
    });
    this.map.getView().fit(vector.getExtent());
    this.map.addLayer(this.layerLines);
  }

  @Emit()
  click(e: MapBrowserEvent) {
    // eslint-disable-next-line no-underscore-dangle
    return this.map.getFeaturesAtPixel(e.pixel).map((feat) => feat.values_);
  }

  @Watch('geojson', { deep: true })
  updateSource(geojson: object) {
    const source = this.seaportsGeoJSON.getSource();

    const features = new GeoJSON({
      featureProjection: 'EPSG:3857',
    }).readFeatures(geojson);

    source.clear();
    source.addFeatures(features);
  }

  @Watch('coordinates')
  updateCoordinates(coordinates: number[][]) {
    this.drawLine(coordinates);
  }
}
</script>

<style lang="scss" scoped>
@import '~ol/ol.css';
.map-container {
  --drawer-spacing: 256px;
  margin-left: var(--drawer-spacing);
  width: calc(100% - var(--drawer-spacing));
  height: 100%;
}
</style>
