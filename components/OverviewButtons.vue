<template>
  <div class="left">
    <!-- Add NEW Record -->
    <div
      v-if="screen.screenConfig.footer.newRecordButton != false"
      class="option"
      title="New"
      @click="addNewRecord"
    >
      <div class="icon">
        <i class="fas fa-plus"></i>
      </div>
    </div>
    <!-- Refresh Data -->
    <div class="option" title="Refresh" @click="refreshData">
      <div class="icon">
        <i class="fas fa-redo"></i>
      </div>
    </div>
  </div>
</template>
<script>
import Actions from "../lib/actions";
export default {
  props: ["screen"],
  methods: {
    addNewRecord() {
      const { screen } = this;
      screen.overview = false;
      screen.insertMode = true;
      screen.newForm = true;
      screen.form = {};
    },
    refreshData() {
      const { screen } = this;
      screen.sendActionRequest({
        name: Actions.REFRESH_OVERVIEW_DATA,
      });
    },
  },
};
</script>