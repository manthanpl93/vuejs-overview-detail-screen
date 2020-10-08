<template>
  <div class="option">
    <div class="search-box">
      <input
        placeholder="Search"
        v-model="screen.search['value']"
        @keyup.enter="search"
        class="search-box"
        type="text"
      />
    </div>
    <select
      :value="
        screen.search['category']
          ? screen.search['category']
          : screen.screenConfig.search.default
      "
      @input="
        ($event) => {
          screen.search['category'] = $event.target.value;
        }
      "
      class="search-category"
    >
      <option
        v-for="(item, index) in screen.screenConfig.search.values"
        :key="index"
        :value="item.value"
      >
        {{ item.title }}
      </option>
    </select>
    <div class="icon" title="Search" @click="search">
      <i class="fas fa-search"></i>
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
    search() {
      const searchInputs = this.screen.getSearchInputs();
      if (this.screen.search.value != "") {
        this.screen.sendActionRequest({
          name: Actions.SEARCH_DATA,
          searchInputs,
        });
      } else {
        bootbox.alert("Please enter search value");
      }
    },
  },
};
</script>