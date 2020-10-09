<template>
  <div class="left">
    <!-- Go Back  -->
    <div class="option" title="back" @click="goBack">
      <div class="icon">
        <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
      </div>
    </div>
    <!-- Refresh Record -->
    <div
      v-if="screen.insertMode == false"
      class="option"
      title="Refresh record"
      @click="refreshRecord"
    >
      <div class="icon">
        <FontAwesomeIcon :icon="['fas', 'redo']" />
      </div>
    </div>

    <!-- Save New Record & Update Record -->
    <div
      class="option"
      title="Save"
      @click="
        () => {
          this.screen.insertMode ? this.saveRecord() : this.updateRecord();
        }
      "
    >
      <div class="icon">
        <FontAwesomeIcon :icon="['fas', 'save']" />
      </div>
    </div>

    <!-- Delete Record -->
    <div
      v-if="screen.insertMode == false"
      class="option"
      title="Delete record"
      @click="deleteRecord"
    >
      <div class="icon">
        <FontAwesomeIcon :icon="['fas', 'trash']" />
      </div>
    </div>
  </div>
</template>
<script>
import Actions from "../lib/actions";
// fontawesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faSave,
  faRedo,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrash, faSave, faRedo, faArrowLeft);
export default {
  components: { FontAwesomeIcon },
  props: ["screen"],
  methods: {
    goBack() {
      const { screen } = this;
      screen.overview = true;
    },
    async refreshRecord() {
      const { screen } = this;
      const formData = screen.getFormData();
      screen.sendActionRequest({
        name: Actions.REFRESH_RECORD,
        formData,
      });
    },
    async saveRecord() {
      const { screen } = this;
      let status = true;
      if (screen.screenConfig.detail.validation)
        status = await this.inputsValidation();
      if (status) {
        const formData = screen.getFormData();
        screen.sendActionRequest({
          name: Actions.SAVE_NEW_RECORD,
          formData,
        });
      }
    },
    async updateRecord() {
      const { screen } = this;
      let status = true;
      if (screen.screenConfig.detail.validation)
        status = await this.inputsValidation();
      if (status) {
        const formData = screen.getFormData();
        screen.sendActionRequest({
          name: Actions.UPDATE_RECORD,
          formData,
        });
      }
    },
    async deleteRecord() {
      const { screen } = this;
      bootbox.confirm(
        "Are you sure, you want to remove this record?",
        async (result) => {
          if (result == true) {
            const formData = screen.getFormData();
            screen.sendActionRequest({
              name: Actions.DELETE_RECORD,
              formData,
            });
          }
        }
      );
    },
    async inputsValidation() {
      const { screen } = this;
      let status = true;
      if (screen.validations.length) {
        for (let itr = 0; itr < screen.validations.length; itr++) {
          const element = screen.validations[itr];
          const result = await element.validationCheck();
          status = status && result;
        }
      }
      return status;
    },
  },
};
</script>