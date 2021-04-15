<template>
  <v-container class="main">
    <v-navigation-drawer absolute
                         permanent
                         touchless>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete v-model="source"
                            :items="cities"
                            @focus="activeField = 'src'"
                            label="Skąd startujesz?" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete v-model="destination"
                            :items="cities"
                            @change="card = true"
                            @focus="activeField = 'dest'"
                            label="Dokąd płyniesz?" />
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
      <MapContainer :coordinates="coordinates"
                    :color="color"
                    :geojson="geoFeatures"
                    @click="mapClicked"/>
      <CovidPanel :destination="destinationPort"
                  :source="findPort(source)"
                  @danger="colorCode"
                  @close="card = false"
                  v-if="card"
                  class="center-xy"/>
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
import CovidPanel from '@/Components/CovidPanel.vue';
import MapContainer from '@/Components/Map.vue';
import GeoService from '@/services/Geo';
import { FeatureCollectionInterface } from '@/types/feature-collection.interface';
import { FeatureInterface } from '@/types/feature.interface';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  name: 'Main',
  components: { CovidPanel, MapContainer },
})
export default class Main extends Vue {
  source = '';

  destination = '';

  activeField = '';

  color = '';

  snackbar = false;

  card = false;

  geoFeatures: FeatureCollectionInterface = {
    type: 'FeatureCollection',
    features: [],
  }

  coordinates: number[][] = [];

  async mounted() {
    this.geoFeatures.features = await GeoService.FeaturizePorts();
  }

  mapClicked(features: { Port: string }[]) {
    if (this.activeField === 'src') this.source = features[0].Port;
    if (this.activeField === 'dest') {
      this.destination = features[0].Port;
      this.card = true;
    }
    this.activeField = '';
  }

  get cities() {
    return this.geoFeatures.features.map((feature) => feature.properties.Port);
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
    await this.$nextTick();
    this.color = '';
  }

  colorCode(color: string) {
    this.color = color;
  }

  private get destinationPort(): FeatureInterface | undefined {
    return this.findPort(this.destination);
  }

  private findPort(name: string): FeatureInterface | undefined {
    return this.geoFeatures.features
      .find((e) => e.properties.Port.toLowerCase().trim() === name.toLowerCase().trim());
  }

  private findCoordinatesFor(name: string): number[] | undefined {
    return this.findPort(name)?.geometry.coordinates;
  }
}
</script>

<style lang="scss" scoped>
.main {
  --drawer-spacing: 256px;
  height: 100%;
  .map {
    width: 100%;
    margin-left: var(--drawer-spacing);
    height: 100%;
    position: relative;
    .center-xy {
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translate(50%, -50%);
    }
  }
}
</style>
