<template>
  <v-app id="app">
    <receive v-if="token" :token="token"></receive>
    <share v-else></share>
  </v-app>
</template>

<script>

import Receive from './components/Receive.vue';
import Share from './components/Share';

export default {
  components: {
    Share,
    Receive,
  },
  computed: {
    token() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    }
  }
}
</script>
