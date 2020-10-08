<template>
  <div class="footer">
    <div class="screen-options">
      <OverviewButtons v-if="screen.overview == true" :screen="screen" />
      <DetailButtons v-else :screen="screen" />
      <div class="centre" v-if="screen.overview && screen.screenConfig.search">
        <SearchBox :screen="screen" />
      </div>
      <div
        class="right"
        v-if="screen.overview && screen.screenConfig.pagination != false"
      >
        <Pagination :screen="screen" />
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from "./Pagination";
import SearchBox from "./SearchBox";
import OverviewButtons from "./OverviewButtons";
import DetailButtons from "./DetailButtons";
export default {
  props: ["screen", "ScreenUtility"],
  components: {
    Pagination,
    SearchBox,
    OverviewButtons,
    DetailButtons,
  },
  mounted() {
    this.buttons = this.fetchButtons();
  },
  computed: {
    overview() {
      return this.screen.overview;
    },
    insertMode() {
      return this.screen.insertMode;
    },
  },
  watch: {
    overview() {
      this.buttons = this.fetchButtons();
    },
    insertMode() {
      this.buttons = this.fetchButtons();
    },
  },
  data() {
    return {
      buttons: [],
    };
  },
  methods: {
    fetchButtons() {
      const { screen } = this;
      const { overview, insertMode } = screen;
      const buttons = screen.screenConfig.footer.buttons.filter((item) => {
        if (
          (!item.mode ||
            (item.mode === "insert" && insertMode) ||
            (item.mode === "update" && !insertMode)) &&
          ((item.type === "overview" && overview) ||
            (item.type === "detail" && !overview))
        ) {
          if (
            item.name != "remove" ||
            (item.name === "remove" && this.$auth.user.role === "admin")
          ) {
            return item;
          }
        }
      });
      return buttons;
    },
  },
};
</script>