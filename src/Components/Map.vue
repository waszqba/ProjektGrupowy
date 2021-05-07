<template>
  <div class="map-container"
       ref="mapRoot" />
</template>

<script lang="ts">
import type { MapBrowserEvent } from 'ol';
import { Feature, Map, View } from 'ol';
import { GeoJSON } from 'ol/format';
import { LineString } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { Cluster, OSM, Vector } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Icon, Stroke, Style } from 'ol/style';
import Vue from 'vue';

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

  @Prop()
  color!: string;

  layerLines?: VectorLayer;

  seaportsGeoJSON!: VectorImage;

  $refs!: {
    mapRoot: HTMLElement;
  }

  map!: Map;

  mounted() {
    const genPin = (src: string) => new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src,
      }),
    });
    const pin = genPin('/pin.png');
    const darkPin = genPin('/darkpin.png');

    this.seaportsGeoJSON = new VectorImage({
      source: new Cluster({
        source: new Vector({
          features: new GeoJSON({
            featureProjection: 'EPSG:3857',
          }).readFeatures(this.geojson),
        }),
        distance: 60,
      }),
      visible: true,
      style: (feature) => {
        if (feature.get('features')?.length > 1) return darkPin;
        return pin;
      },
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
    this.map.on('pointermove', function pointer(this: Map, evt) {
      const hit = this.forEachFeatureAtPixel(evt.pixel, () => true);
      if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
      } else {
        this.getTargetElement().style.cursor = '';
      }
    });
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
          color: this.color,
          width: 3,
        }),
      }),
    });
    this.map.getView().fit(vector.getExtent());
    this.map.addLayer(this.layerLines);
  }

  @Emit()
  click(e: MapBrowserEvent) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore hidden Values
    // eslint-disable-next-line no-underscore-dangle
    return this.map.getFeaturesAtPixel(e.pixel).map((feat) => feat.values_);
  }

  @Watch('geojson', { deep: true })
  updateSource(geojson: object) {
    const source = this.seaportsGeoJSON.getSource() as VectorSource;

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
  width: 100%;
  height: 100%;
}
</style>
