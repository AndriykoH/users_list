<template>
  <v-snackbar v-model="snackbar" color="success" top timeout="3000">
    <v-row no-gutters
      ><v-icon style="margin-right: 8px">mdi-check</v-icon>{{ text }}</v-row
    >
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: true,
  }),
  props: {
    text: {
      require: true,
    },
  },
  watch: {
    snackbar: {
      handler() {
        if (this.snackbar == false) {
          this.$emit("close");
        }
      },
    },
  },
};
</script>

<style>
</style>