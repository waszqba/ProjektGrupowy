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
  </v-container>
</template>

<script lang="ts">
import MapContainer from '@/Components/Map.vue';
import FreightLinkService from '@/services/FreightLink';
import { Feature } from 'ol';
import Vue from 'vue';
import VueSimpleAlert from "vue-simple-alert"
import { Component } from 'vue-property-decorator';
import axios from 'axios';
  
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

  coordinates: number[][] = [];
  
  async mounted() {
    this.geoFeatures.features = await FreightLinkService.FeaturizePorts();
  }

  mapClicked(features: Feature[]) {
    console.log(features);
  }
  async findCoordinatesOfRoute() {
    const start = this.findCoordinatesFor(this.source);
    const stop = this.findCoordinatesFor(this.destination);
    if (start && stop) {
      const { data } = await axios.get(`https://api.aquaplot.com/v1/route/from/${start[0]}/${start[1]}/to/${stop[0]}/${stop[1]}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa('OnwhvumBMKdTVEyG:FotCzJtYeSdYuoHq')}`,
        },
      });
      this.coordinates = this.extendCoordinates(data.features[0].geometry.coordinates, start, stop);
    } else {
					Vue.use(VueSimpleAlert);
					this.$alert("Wprowadzono nieprawidłowe dane!");
				}
			
	private extendCoordinates(coordinates: number[][], start: number[], stop: number[]): number[][] {
	return [start, ...coordinates, stop];
	}

  private findCoordinatesFor(name: string): number[] | undefined {
    return this.geoFeatures.features.
	find((e) => e.properties.Port.toLowerCase().trim() 
	=== name.toLowerCase().trim())
	?.geometry.coordinates;
  }
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
