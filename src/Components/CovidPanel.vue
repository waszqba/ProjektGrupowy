<template>
<v-card elevation="3">
  <v-card-title >
    {{ destination.properties.Port }}
    <v-spacer/>
    <v-btn @click="$emit('close')" icon text>
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card-title>
  <v-card-subtitle>
    <strong>
      Ograniczenia podróży
    </strong>
  </v-card-subtitle>
  <v-card-text>
    Kwarantanna w kraju docelowym
    <span v-if="restrictions && restrictions.quarantine"> trwa {{restrictions.quarantine}}.</span>
    <span v-else>nie jest wymagana.</span>
    <p v-if="restriction()">
      Podróżni z portu {{source.properties.Port}}
      <span class="error--text" v-if="restriction().type === 3">
        nie mają wstępu do kraju docelowego.
      </span>
      <span v-else-if="restriction().type === 2">
        muszą odbyć bezwarunkową kwarantannę.
      </span>
      <span v-else>
        muszą odbyć kwarantannę,
        o ile nie przedłożą ujemnego wyniku testu na Covid-19 z ostatniego tygodnia
      </span>
    </p>
  </v-card-text>
  <v-row class="stats">
    <v-col>
      <v-card-subtitle class="pb-0">
        Statystyki z ostatniej doby
      </v-card-subtitle>
      <StatList :stats="stats.latestChange"/>
    </v-col>
    <v-col>
      <v-card-subtitle class="pb-0">
        Dane ogólne
      </v-card-subtitle>
      <StatList :stats="stats"/>
    </v-col>
  </v-row>
</v-card>
</template>

<script lang="ts">
import StatList from '@/Components/StatList.vue';
import CovidInfoService from '@/services/CovidInfo';
import GeoService from '@/services/Geo';
import { FeatureInterface } from '@/types/feature.interface';
import { RestrictionInterface } from '@/types/restrictions.interface';
import { StatsInterface } from '@/types/stats.interface';
import Vue from 'vue';
import {
  Component, Emit, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  name: 'CovidPanel',
  components: { StatList },
})
export default class CovidPanel extends Vue {
  @Prop()
  destination!: FeatureInterface;

  @Prop()
  source!: FeatureInterface;

  stats: StatsInterface | { latestChange: {} } = { latestChange: {} };

  restrictions: RestrictionInterface = {
    quarantine: 0,
    restrictions: null,
  };

  created() {
    this.statsFinder();
    this.restrictionsFinder();
  }

  @Watch('destination')
  private async statsFinder() {
    const countries = await GeoService.getCountries();
    const countrySlug = countries[this.destination.properties.Kraj].slug;
    this.stats = await CovidInfoService.countryStats(countrySlug);
  }

  @Watch('destination')
  fireRes() {
    this.restrictionsFinder();
  }

  @Watch('source')
  async restrictionsFinder() {
    this.restrictions = await CovidInfoService
      .countryRestrictions(this.destination.properties.Kraj);
    this.danger();
    this.$forceUpdate();
  }

  @Emit()
  danger() {
    if (!this.restrictions?.quarantine) return '#00ff00';
    const restriction = this.restriction();
    if (!restriction) return '#0000ff';
    return ['', '#ffff00', '#ff8000', '#ff0000'][(restriction as {type: number}).type];
  }

  restriction(): { countryId: number; type: number } | null {
    if (!this.source || !this.restrictions?.restrictions) {
      return null;
    }
    const filteredRestrictions = this.restrictions.restrictions
      .filter((res) => res.countryId === this.source.properties.Kraj);
    if (!filteredRestrictions.length) return null;
    return filteredRestrictions[0];
  }
}
</script>

<style scoped>
.stats {
  min-width: 450px;
}
</style>
