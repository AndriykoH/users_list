<template>
  <v-dialog v-model="visibility" width="500px" height="max-content">
    <v-card style="padding: 20px">
      <p class="confirmText">{{ text }}</p>
      <v-row no-gutters style="margin-top: 12px">
        <v-btn
          @click="$emit('close')"
          outlined
          color="primary"
          width="calc(50% - 8px)"
          style="margin-right: 16px"
          >Скасувати</v-btn
        >
        <v-btn @click="$emit('confirm')" color="error" width="calc(50% - 8px)"
          >Видалити</v-btn
        >
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import modalMixin from "../mixins/modalMixin";

export default {
  mixins: [modalMixin],
  props: {
    text: {
      require: true,
    },
  },
};
</script>

<style scoped>
.confirmText {
    font-weight: 500;
    font-size: 18px;
    text-align: center;
}
</style>