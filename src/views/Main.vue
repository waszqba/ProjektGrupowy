<template>
  <v-container class="main">
    <v-navigation-drawer absolute
                         permanent
                         touchless>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-text-field v-model="source" label="Skąd startujesz?" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field v-model="destination" label="Dokąd płyniesz?" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="findCoordinatesOfRoute" link>
          <v-list-item-content>
            <v-list-item-title>
              SZUKAJ POŁĄCZEŃ
            </v-list-item-title>
          </v-list-item-content>
            <v-list-item-icon><v-icon>mdi-map-marker-path</v-icon></v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="map">
      <MapContainer :coordinates="coordinates" :geojson="geoFeatures" @click="mapClicked"/>
    </div>
    <v-snackbar
      v-model="snackbar"
      color="error"
      timeout="3000"
    >
      Wprowadzono nieprawidłowe dane
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import MapContainer from '@/Components/Map.vue';
import GeoService from '@/services/Geo';
import { FeatureCollectionInterface } from '@/types/feature-collection.interface';
import { Feature } from 'ol';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'Main',
  components: { MapContainer },
})
export default class Main extends Vue {
  source = '';

  destination = '';

  snackbar = false;

  geoFeatures: FeatureCollectionInterface = {
    type: 'FeatureCollection',
    features: [],
  }

  coordinates: number[][] = [];

  async mounted() {
    this.geoFeatures.features = await GeoService.FeaturizePorts();
  }

  mapClicked(features: Feature[]) {
    console.log(features);
  }

  async findCoordinatesOfRoute() {
    const start = this.findCoordinatesFor(this.source);
    const stop = this.findCoordinatesFor(this.destination);
    if (!start || !stop) {
      this.snackbar = true;
      return;
    }
    const data = await (await fetch(`https://api.aquaplot.com/v1/route/from/${start[0]}/${start[1]}/to/${stop[0]}/${stop[1]}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa('OnwhvumBMKdTVEyG:FotCzJtYeSdYuoHq')}`,
      },
    })).json();
    this.coordinates = [start, ...data.features[0].geometry.coordinates, stop];
  }

  private findCoordinatesFor(name: string): number[] | undefined {
    return this.geoFeatures.features
      .find((e) => e.properties.Port.toLowerCase().trim() === name.toLowerCase().trim())
      ?.geometry.coordinates;
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  .map {
    height: 100%;
  }
}
</style>
