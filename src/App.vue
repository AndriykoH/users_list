<template>
  <div id="app">
    <v-app>
      <Main />
    </v-app>
  </div>
</template>

<script>
import Main from "./views/Main.vue";

export default {
  name: "App",
  components: {
    Main,
  },
};
</script>

<style>
#app {
}
</style>
