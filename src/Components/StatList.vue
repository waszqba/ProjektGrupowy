<template>
  <v-list class="pt-0">
    <v-list-item two-line>
      <v-list-item-content class="py-0">
        <v-list-item-title>Zakażenia</v-list-item-title>
        <v-list-item-subtitle>{{ stats.confirmed }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content class="py-0">
        <v-list-item-title>Chorzy</v-list-item-title>
        <v-list-item-subtitle>{{ stats.active }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content class="py-0">
        <v-list-item-title>Zgony</v-list-item-title>
        <v-list-item-subtitle>{{ stats.deaths }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content class="py-0">
        <v-list-item-title>Ozdrowienia</v-list-item-title>
        <v-list-item-subtitle>{{ stats.recovered }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { StatsInterface } from '@/types/stats.interface';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'StatList',
})
export default class StatList extends Vue {
  @Prop()
  stats: StatsInterface | {} = {};
}
</script>

<style scoped>
.v-list--dense .v-list-item.v-list-item--two-line {
  min-height: 40px !important;
}
</style>
