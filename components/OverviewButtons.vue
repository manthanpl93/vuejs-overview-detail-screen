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
        <FontAwesomeIcon :icon="['fas', 'plus']" />
      </div>
    </div>
    <!-- Refresh Data -->
    <div class="option" title="Refresh" @click="refreshData">
      <div class="icon">
        <FontAwesomeIcon :icon="['fas', 'redo']" />
      </div>
    </div>
  </div>
</template>
<script>
import Actions from "../lib/actions";
// fontawesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlus, faRedo);
export default {
  props: ["screen"],
  components: { FontAwesomeIcon },
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