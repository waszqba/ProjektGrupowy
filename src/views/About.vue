<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
import { CountryCodesEnum as CCE } from '@/services/TravelSafe/countryCodes';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import TravelSafeService from '../services/TravelSafe';

@Component({
  name: 'About',
})
export default class About extends Vue {
  someData = {};

  async mounted() {
    this.someData = await TravelSafeService.getRestrictions(CCE.BHUTAN, CCE.ARGENTINA);
  }
}
</script>
