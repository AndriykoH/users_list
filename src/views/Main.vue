<template>
  <v-main>
    <v-container>
      <main-component />
    </v-container>
  </v-main>
</template>

<script>
import mainComponent from "@/components/mainComponent.vue";
export default {
  name: "MainViews",
  components: { mainComponent },
};
</script>

<style>
</style>