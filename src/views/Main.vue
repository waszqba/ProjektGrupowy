<template>
  <v-container class="main">
    <v-navigation-drawer absolute
                         permanent
                         touchless>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete hint="Kliknij wybrany port na mapie" :items="cities"
            persistent-hint v-model="source" label="Skąd startujesz?" @focus="currentlyActiveField = 'src'" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete hint="Kliknij wybrany port na mapie" :items="cities"
            persistent-hint v-model="destination" label="Dokąd płyniesz?" @focus="currentlyActiveField = 'dest'" />
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
import { Component } from 'vue-property-decorator';
import axios from 'axios';

@Component({
  name: 'Main',
  components: { MapContainer },
})
export default class Main extends Vue {
  source = '';

  destination = '';

  cities = ['Liverpool', 'Southampton', 'Belfast', 'Calais', 'Heysham', 'Oslo', 'Kilonia', 'Cairnryan', 'Dover', 'Folkestone', 'Dunkierka', 'Holyhead', 'Dublin', 'Hoek van Holland', 'Killingholme', 'Sztokholm', 'Helsinki', 'Tallinn', 'Portsmouth', 'Caen', 'Fishguard', 'Rosslare', 'Pembroke', 'Hirtshals', 'Kristiansand', 'Larvik', 'Barcelona', 'Palma Mallorca', 'Walencja', 'Ibiza', 'Maó', 'Kadyks', 'Arrecife', 'Las Palmas Gran Canaria', 'Santa Cruz de La Palma', 'Santa Cruz de Tenerife', 'Puerto Rosario', 'Algeciras', 'Ceuta', 'Tanger Med', 'Almería', 'Ghazaouet', 'Melilla', 'Nador', 'Oran', 'Malaga', 'Bari', 'Durres', 'Ryga', 'Travemunde', 'Alcudia', 'Ciutadella', 'San Antonio', 'Denia', 'Ardrossan', 'Armadale', 'Berneray', 'Brodick', 'Campbeltown', 'Canna', 'Castlebay', 'Claonaig', 'Colintraive', 'Coll', 'Colonsay', 'Craignure', 'Cumbrae', 'Eigg', 'Eriskay', 'Fionnphort', 'Fishnish', 'Gigha', 'Iona', 'Kennacraig', 'Kilchoan', 'Largs', 'Leverburgh', 'Lismore', 'Lochaline', 'Lochboisdale', 'Lochmaddy', 'Lochranza', 'Mallaig', 'Muck', 'Oban', 'Port Askaig', 'Port Ellen', 'Portavadie', 'Raasay', 'Rhubodach', 'Rothesay', 'Rum', 'Sconser', 'Stornoway', 'Tarbert (Harris)', 'Tarbert (Loch Fyne)', 'Tayinloan', 'Tiree', 'Tobermory', 'Uig', 'Ullapool', 'Wemyss Bay', 'Bilbao', 'Cherbourg', 'Poole', 'Cork', 'Roscoff', 'Hawr', 'Plymouth', 'Santander', 'St Malo', 'Barra', 'Kirkwall', 'Rotterdam', 'Zeebrugge', 'Purfleet', 'Stromstad', 'Sandefjord', 'Jersey', 'Guernsey', 'Brevik', 'Immingham', 'Cuxhaven', 'Esbjerg', 'Rotterdam Vlaardingen', 'Göteborg', 'Ijmuiden', 'Newcastle', 'Rosyth', 'Felixstowe', 'Douglas', 'Aberdeen', 'Lerwick', 'Scrabster', 'Stromness', 'Dieppe', 'Newhaven', 'Larne', 'Hull', 'Tilbury', 'Teesport', 'Puttgarden', 'Rodby', 'Helsingor', 'Helsingborg', 'Rostock', 'Gedser', 'Warrenpoint', 'Liverpool Birkenhead', 'Frederikshavn', 'Gdynia', 'Karlskrona', 'Grenaa', 'Varberg', 'Harwich', 'Liepaja', 'Nynashamn', 'Ventspils', 'Trelleborg', 'Sassnitz', 'Kapellskar', 'Paldiski', 'Turku', 'Fishbourne', 'Świnoujście', 'Ystad', 'Lymington', 'Yarmouth', 'Toulon', 'Ajaccio', 'Bastia', 'Ile Rousse', 'Nicea', 'Savona', 'Livorno', 'Golfo Aranci', 'Visby', 'Oskarshamn', 'Naantali', 'Stavanger', 'Bergen', 'Malmö', 'Genoa', 'Porto Torres', 'Palermo', 'Tunis', 'Civitavecchia', 'Naples', 'Cagliari', 'Salerno', 'Katania', 'Brindisi', 'Ravenna', 'Patras', 'Valletta', 'Igoumenitsa', 'Bar', 'Ankona', 'Split', 'Dubrownik', 'Olbia', 'Piombino', 'Gdańsk', 'Kopenhaga', 'Lavrio', 'Limassol', 'Hanko', 'Arbatax', 'Umea', 'Vaasa', 'Pozzallo', 'Seydisfjordur', 'Heraklion', 'Piraeus', 'Helsinki Vuosaari', 'Portoferraio', 'Kłajpeda', 'Karlshamn', 'Mykonos', 'Cowes', 'Corfu', 'Rhodes', 'Santorini', 'Langesund', 'Venice', 'Maarianhamina', 'Haydarpasa', 'Chornomorsk', 'Marsylia', 'Thorlakshofn', 'Torshavn', 'Gandawa', 'Termini Imerese', 'Oxelösund', 'Ronne', 'Sete', 'Kos', 'Trieste', 'Ust Luga', 'Fredericia', 'St Petersburg', 'Porto Vecchio', 'Zadar', 'Langnas', 'Chania', 'Koge', 'Motril', 'Tanger Ville', 'Tarifa', 'Samos (Karlovassi)', 'Samos (Vathy)', 'Messina', 'Brunsbuttel', 'Muuga', 'Batumi', 'Burgas', 'Alsancak', 'Propriano', 'Varna', 'Poti', 'Huelva', 'Havneby', 'Lista', 'Svendborg', 'Ærøskøbing', 'Fynshav', 'Soby', 'Faaborg', 'Volos', 'Kyllini', 'Kavala', 'Leixoes', 'Backaland Eday', 'Whitehall Stronsay', 'Loth Sanday', 'Rapness Westray', 'Lubeck', 'Trapani', 'Kavkaz', 'Agaete', 'Sagunto', 'Halmstad', 'Pendik', 'Yalova', 'Mersin', 'Villa San Giovanni', 'Karasu', 'Constanta', 'Uusikaupunki', 'Valona', 'Formentera', 'Hou', 'SÆlvig'];

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
    if (this.currentlyActiveField === 'src') this.source = features[0].Port;
    if (this.currentlyActiveField === 'dest') this.destination = features[0].Port;
  }

  async findCoordinatesOfRoute() {
    const start = this.findCoordinatesFor(this.source);
    const stop = this.findCoordinatesFor(this.destination);
    if (start && stop) {
      const { data } = await axios.get(`https://api.aquaplot.com/v1/route/from/${start![0]}/${start![1]}/to/${stop![0]}/${stop![1]}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa('OnwhvumBMKdTVEyG:FotCzJtYeSdYuoHq')}`,
        },
      });
      this.coordinates = this.extendCoordinates(data.features[0].geometry.coordinates, start, stop);
    } else {
      alert('Wpisano nieprawidłowe dane.');
    }
  }

  private extendCoordinates(coordinates: number[][], start: number[], stop: number[]): number[][] {
    coordinates.unshift(start);
    coordinates.push(stop);
    return coordinates;
  }

  private findCoordinatesFor(name: string): number[] | undefined {
    return this.geoFeatures.features.find((e) => e.properties.Port.toLowerCase().trim() === name.toLowerCase().trim())?.geometry.coordinates;
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
.ignore-stylesheet .blocks-other-than-script-and-template-are-ignored .this-line-has-a-length-of-100
{}
</style>
