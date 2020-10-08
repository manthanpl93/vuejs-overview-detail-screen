<template>
  <div class="input">
    <div class="input-field">
      <div class="title">{{ input.title }}:</div>
      <div class="value-container">
        <select
          v-if="input.type === 'dropdown'"
          :value="
            screen.form[input.value] ? screen.form[input.value] : input.default
          "
          @input="
            ($event) => {
              screen.form[input.value] = $event.target.value;
            }
          "
        >
          <option
            v-for="(item, index) in input.values"
            :value="item.value"
            :key="index"
          >
            {{ item.title }}
          </option>
        </select>
        <input
          type="text"
          v-else-if="input.type === 'textbox'"
          v-model="screen.form[input.value]"
        />
        <textarea
          v-else-if="input.type === 'textarea'"
          v-model="screen.form[input.value]"
        />
      </div>
    </div>
    <div class="validation-field">
      <p v-if="!validate" class="validation-message">{{ validationMessage }}</p>
    </div>
  </div>
</template>
<script>
import { noblank, currency, email } from "~/library/validations";
export default {
  props: ["input", "screen", "parentScreen"],
  data() {
    return {
      validate: true,
      validationMessage: "",
    };
  },
  mounted() {
    let { screen, input } = this;
    if (!screen.form[input.value])
      screen.form[input.value] = input.default || "";
    if (screen.screenConfig.detail.validation) {
      screen.validations.push(this);
    }
  },
  methods: {
    validationCheck: async function () {
      let { input, screen } = this;
      if (input.validation && input.validation.length) {
        for (let itr = 0; itr < input.validation.length; itr++) {
          const result = await this.validateMethod(input.validation[itr]);
          this.validate = result.status;
          if (!result.status) {
            this.validationMessage = result.message;
            break;
          } else {
            this.validationMessage = "";
          }
        }
      }
      return this.validate;
    },
    validateMethod: async function (validation) {
      let { input, screen } = this;
      const formData = screen.getFormData();
      const value = formData[input.value];
      switch (validation.type) {
        case "noblank":
          return noblank(value);
        case "currency":
          return currency(value);
        case "email":
          return email(value);
        case "custom":
          return await this.parentScreen[validation.method](value);
      }
    },
  },
};
</script>