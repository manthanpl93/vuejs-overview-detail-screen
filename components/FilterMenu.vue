<template>
  <div class="filter">
    <div
      class="backdrop"
      @click="
        () => {
          ScreenUtility.filterVisible = false;
        }
      "
    />
    <div class="filter-values">
      <div
        class="value"
        v-for="(option, index) in screen.screenConfig.filter"
        :key="index"
      >
        <div class="title">{{ option.title }}</div>
        <select
          v-if="option.type === 'dropdown'"
          :value="
            screen.filter[option.value]
              ? screen.filter[option.value]
              : option.default
          "
          @input="
            ($event) => {
              screen.filter[option.value] = $event.target.value;
            }
          "
        >
          <option
            v-for="(item, index) in option.values"
            :value="item.value"
            :key="index"
            v-bind:selected="index === 0 ? 'selected' : false"
          >
            {{ item.title }}
          </option>
        </select>
        <input
          v-else-if="option.type === 'datetimepicker'"
          :value="
            screen.filter[option.value]
              ? screen.filter[option.value]
              : defaultValue(option)
          "
          @input="
            ($event) => {
              screen.filter[option.value] = $event.target.value;
            }
          "
        />
        <DateRangePicker
          v-else-if="option.type === 'date-range-picker'"
          :screen="screen"
          :option="option"
        />
        <DatePicker
          v-else-if="option.type === 'date-picker'"
          :value="screen.filter[option.value]"
          :setter="
            (value) => {
              screen.filter[option.value] = value;
            }
          "
          :convert="true"
        />
      </div>
      <div class="value filter-button">
        <button
          type="button"
          class="btn btn-primary active"
          @click="filterRecords"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import DateRangePicker from "~/components/DateRangePicker";
import DatePicker from "~/components/DatePicker";
import Actions from "../lib/actions";
export default {
  props: ["screen", "ScreenUtility"],
  components: {
    DateRangePicker,
    DatePicker,
  },
  data() {
    return {
      dateRange: {
        // used for v-model prop
        startDate: moment().subtract(30, "days"),
        endDate: moment().subtract(0, "days"),
      },
    };
  },
  methods: {
    defaultValue(input) {
      if (input.type === "datetimepicker") {
        return moment().format("YYYY-MM-DD HH:mm");
      }
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY HH:mm");
    },
    filterRecords() {
      const filterInputs = this.screen.getFilterInputs();
      const { ScreenUtility } = this;
      this.screen.sendActionRequest({
        name: Actions.FILTER_DATA,
        filterInputs,
      });
      ScreenUtility.filterVisible = false;
    },
  },
};
</script>