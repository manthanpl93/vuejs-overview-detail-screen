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
              <i
                v-if="
                  screen.columnsOrder[item.value] &&
                  screen.columnsOrder[item.value].order == 'ascending'
                "
                class="fas fa-caret-up"
              ></i>
              <i
                v-if="
                  screen.columnsOrder[item.value] &&
                  screen.columnsOrder[item.value].order == 'decending'
                "
                class="fas fa-caret-down"
              ></i>
              <i
                v-if="
                  item.advanceOptions &&
                  item.advanceOptions.ordering &&
                  !screen.columnsOrder[item.value] == true
                "
                class="fas fa-minus"
              ></i>
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
                <i class="fas fa-bars"></i>
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
                  <div class="icon"><i class="fas fa-caret-up"></i></div>
                  <div class="title">Ascending</div>
                </div>
                <div class="option" @click="setColumnOrder(item, 'decending')">
                  <div class="icon"><i class="fas fa-caret-down"></i></div>
                  <div class="title">Decending</div>
                </div>
                <div class="option" @click="setColumnOrder(item, 'no order')">
                  <div class="icon"><i class="fas fa-minus"></i></div>
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
export default {
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