<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="SafeSailor Logo"
          class=" mr-2"
          contain
          src="./assets/SSLogo.png"
          transition="scale-transition"
          width="70"
        />

        <h3>Zaplanuj podróż</h3>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="$router.push('/about')"
        text
      >
        <span class="mr-2">O aplikacji</span>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>
