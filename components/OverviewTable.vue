<template>
  <div class="overview-data">
    <table
      class="table table-bordered"
      :class="
        screen.screenConfig.detail &&
        screen.screenConfig.detail.update != false &&
        'table-hover'
      "
    >
      <thead>
        <tr>
          <th v-for="(item, index) in screen.screenConfig.records" :key="index">
            <div
              class="column"
              @mouseenter="() => (hoveredColumnIndex = index)"
              @mouseleave="
                () => {
                  hoveredColumnIndex = null;
                  hoveredAdvanceOptions = null;
                }
              "
            >
              {{ item.title }}
              <!-- Ascending Icon -->
              <FontAwesomeIcon
                v-if="
                  screen.columnsOrder[item.value] &&
                  screen.columnsOrder[item.value].order == 'ascending'
                "
                :icon="['fas', 'caret-up']"
              />
              <!-- decending Icon -->
              <FontAwesomeIcon
                v-if="
                  screen.columnsOrder[item.value] &&
                  screen.columnsOrder[item.value].order == 'decending'
                "
                :icon="['fas', 'caret-down']"
              />
              <!-- No Order Icon -->
              <FontAwesomeIcon
                v-if="
                  item.advanceOptions &&
                  item.advanceOptions.ordering &&
                  !screen.columnsOrder[item.value] == true
                "
                :icon="['fas', 'minus']"
              />
            </div>
            <div
              v-if="
                item.advanceOptions &&
                item.advanceOptions.ordering == true &&
                index == hoveredColumnIndex
              "
              class="header-advance"
            >
              <div
                class="header"
                @mouseenter="
                  () => {
                    hoveredAdvanceOptions = true;
                    hoveredColumnIndex = index;
                  }
                "
                @mouseleave="() => (hoveredAdvanceOptions = null)"
              >
                <FontAwesomeIcon :icon="['fas', 'bars']" />
              </div>
              <div
                class="options"
                v-if="hoveredAdvanceOptions == true"
                @mouseenter="() => (hoveredAdvanceOptions = true)"
                @mouseleave="
                  () => {
                    hoveredAdvanceOptions = null;
                    hoveredColumnIndex = null;
                  }
                "
              >
                <div class="option" @click="setColumnOrder(item, 'ascending')">
                  <div class="icon">
                    <FontAwesomeIcon :icon="['fas', 'caret-up']" />
                  </div>
                  <div class="title">Ascending</div>
                </div>
                <div class="option" @click="setColumnOrder(item, 'decending')">
                  <div class="icon">
                    <FontAwesomeIcon :icon="['fas', 'caret-down']" />
                  </div>
                  <div class="title">Decending</div>
                </div>
                <div class="option" @click="setColumnOrder(item, 'no order')">
                  <div class="icon">
                    <FontAwesomeIcon :icon="['fas', 'minus']" />
                  </div>
                  <div class="title">No order</div>
                </div>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in screen.records"
          :key="index"
          @dblclick="
            () => {
              const detail = screen.screenConfig.detail;
              if (detail && detail.update != false) {
                screen.overview = false;
                newForm = false;
                screen.insertMode = false;
                screen.form = JSON.parse(JSON.stringify(record));
                screen.form.id = record[screen.screenConfig.detail.primaryKey];
              }
            }
          "
        >
          <td v-for="(item, index) in screen.screenConfig.records" :key="index">
            {{
              item.type === "method"
                ? screen[item.methodName](record)
                : record[item.value]
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Actions from "../lib/actions";
// fontawesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretUp,
  faCaretDown,
  faMinus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faCaretUp, faCaretDown, faMinus, faBars);
export default {
  components: { FontAwesomeIcon },
  props: ["screen"],
  mounted() {},
  data() {
    return {
      hoveredColumnIndex: null,
      hoveredAdvanceOptions: null,
    };
  },
  methods: {
    setColumnOrder(item, order) {
      const { screen } = this;
      const columnsOrderInputs = this.screen.getColumnsOrderInputs();
      if (order == "no order") {
        if (screen.columnsOrder[item.value]) {
          delete screen.columnsOrder[item.value];
        }
      } else {
        screen.columnsOrder[item.value] = { order };
      }
      screen.sendActionRequest({
        name: Actions.COLUMN_ORDER,
        column: item.value,
        order: order,
        columnsOrderInputs,
      });
    },
  },
};
</script>