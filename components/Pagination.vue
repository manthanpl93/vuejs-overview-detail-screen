<template>
  <div class="pagination">
    <div class="option page-records-size">
      <div class="icon" title="Page size">
        <i class="fas fa-align-justify"></i>
      </div>
      <div class="records-size-options">
        <select :value="screen.pagination.limit" @input="changePageRecordsSize">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
      </div>
    </div>
    <div class="option pagination">
      <div class="title">
        <span class="start-index">{{ screen.pagination.startIndex }}</span>
        <span>-</span>
        <span class="start-index">{{ screen.pagination.endIndex }}</span>
        <span class="start-index">of</span>
        <span>{{ screen.pagination.total }}</span>
      </div>
      <div
        class="icon previos"
        :class="screen.pagination.startIndex == 1 && 'disabled'"
        @click="this.previosPage"
        title="Previous"
      >
        <i class="fas fa-chevron-left"></i>
      </div>
      <div
        class="icon next"
        :class="
          screen.pagination.endIndex == screen.pagination.total && 'disabled'
        "
        @click="this.nextPage"
        title="Next"
      >
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
  </div>
</template>
<script>
import Actions from "../lib/actions";
export default {
  props: ["screen"],
  mounted() {
    const { screen } = this;
    if (!screen.search["category"])
      screen.search["category"] = screen.screenConfig.search.default;
  },
  methods: {
    changePageRecordsSize($event) {
      const { screen } = this;
      screen.pagination.limit = $event.target.value;
      const pagination = this.screen.getPaginationData();
      screen.sendActionRequest({
        name: Actions.CHANGE_PAGE_SIZE,
        pagination,
      });
    },
    previosPage() {
      const { screen } = this;
      const pagination = this.screen.getPaginationData();
      if (pagination.startIndex != 1) {
        pagination.skip -= 1;
        screen.sendActionRequest({
          name: Actions.PREVIOUS_PAGE,
          pagination,
        });
      } else {
        bootbox.alert("Invalid page");
      }
    },
    nextPage() {
      const { screen } = this;
      const pagination = this.screen.getPaginationData();
      if (pagination.endIndex != pagination.total) {
        pagination.skip += 1;
        screen.sendActionRequest({
          name: Actions.NEXT_PAGE,
          pagination,
        });
      } else {
        bootbox.alert("Invalid page");
      }
    },
  },
};
</script>