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
        <v-list-item link>
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
      <MapContainer :geojson="geoFeatures" @click="mapClicked"/>
    </div>
  </v-container>
</template>

<script lang="ts">
import MapContainer from '@/Components/Map.vue';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'Main',
  components: { MapContainer },
})
export default class Main extends Vue {
  source = '';

  destination = '';

  geoFeatures = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          Port: 'Gdynia',
          Kraj: 'Polska',
        },
        geometry: {
          type: 'Point',
          coordinates: [
            18.547325134277344,
            54.53552570222646,
          ],
        },
      },
    ],
  }

  mapClicked(features) {
    console.log(features);
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
