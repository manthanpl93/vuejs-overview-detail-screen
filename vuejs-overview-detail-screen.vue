<template>
  <div class="content-screen">
    <div v-if="screen.loading" class="loading-overlay">
      <md-progress-spinner
        :md-diameter="120"
        :md-stroke="6"
        md-mode="indeterminate"
      ></md-progress-spinner>
    </div>
    <div v-if="screen.overview == true" class="screen overview">
      <TitleFrame :screen="screen" />
      <FilterMenu v-if="filterVisible" :screen="screen" :ScreenUtility="this" />
      <OverviewTable :screen="screen" />
    </div>
    <div v-else class="screen">
      <div v-if="detailScreen" class="detail">
        <component
          :is="detailScreen"
          :block="block"
          :screen="screen"
        ></component>
      </div>
      <div v-else class="detail">
        <div class="input-values">
          <InputBox
            v-for="(input, index) in screenConfig.detail.inputs"
            :key="index"
            :input="input"
            :screen="screen"
            :parentScreen="parent"
          />
        </div>
      </div>
    </div>
    <Footer v-if="screenConfig.footer" :screen="screen" />
  </div>
</template>
<script>
import {
  InputBox,
  FilterMenu,
  OverviewTable,
  Footer,
  TitleFrame,
} from "./components";
import Actions from "./lib/actions";
import "./vuejs-overview-detail-screen.css";
//vuematerial.io
import init from "./vue-material";
init();
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
export default {
  props: [
    "customVariables",
    "detailScreen",
    "formInitialization",
    "screenConfig",
    "parent",
  ],
  mounted() {
    if (this.customVariables) this.initializeCustomVariables();
    if (this.formInitialization) this.initializeFormData();
  },
  components: {
    InputBox,
    FilterMenu,
    Footer,
    OverviewTable,
    TitleFrame,
  },
  data() {
    return {
      customVariables: {},
      screen: this,
      filterVisible: false,
      newRecord: true,
      search: {
        value: "",
      },
      filter: {},
      pagination: {
        total: 0,
        skip: 1,
        limit: 50,
        startIndex: 0,
        endIndex: 0,
      },
      records: [],
      loading: false,
      overview: true,
      form: {},
      validations: [],
      columnsOrder: {},
      insertMode: false,
    };
  },
  computed: {
    componentLoader() {
      return () => import(`./${this.$attrs.detailScreen}`);
    },
  },
  methods: {
    sendActionRequest(action) {
      this.loading = true;
      this.$emit("actionHandler", action);
    },
    feedBack(data) {
      const { pagination } = this;
      const {
        REFRESH_OVERVIEW_DATA,
        SEARCH_DATA,
        FILTER_DATA,
        CHANGE_PAGE_SIZE,
        NEXT_PAGE,
        PREVIOUS_PAGE,
        COLUMN_ORDER,
        REFRESH_RECORD,
        SAVE_NEW_RECORD,
        UPDATE_RECORD,
        DELETE_RECORD,
      } = Actions;
      let refreshData = false;
      switch (data.action) {
        /* Overview  Events */
        case REFRESH_OVERVIEW_DATA:
        case SEARCH_DATA:
        case FILTER_DATA:
        case CHANGE_PAGE_SIZE:
        case NEXT_PAGE:
        case PREVIOUS_PAGE:
        case COLUMN_ORDER:
          this.records = data.records;
          pagination.total = data.totalSize;
          this.calculatePageIndex();
          break;
        /* Detail  Events */
        case REFRESH_RECORD:
          this.form = data.formData;
          break;
        case SAVE_NEW_RECORD:
          this.overview = data.overview === undefined ? true : data.overview;
          this.insertMode = false;
          refreshData = true;
          break;
        case UPDATE_RECORD:
          this.overview = data.overview === undefined ? true : data.overview;
          this.insertMode = false;
          refreshData = true;
          break;
        case DELETE_RECORD:
          this.overview = data.overview === undefined ? true : data.overview;
          refreshData = true;
          break;
      }
      if (refreshData) {
        this.sendActionRequest({
          name: REFRESH_OVERVIEW_DATA,
        });
      }
      this.loading = false;
    },
    getCustomVariables() {
      return this.customVariables;
    },
    setCustomVariables(values) {
      const customVariables = this.getCustomVariables();
      this.customVariables = {
        ...customVariables,
        ...values,
      };
    },
    getSearchInputs() {
      return this.search;
    },
    getFilterInputs() {
      return this.filter;
    },
    getPaginationData() {
      return this.pagination;
    },
    getColumnsOrderInputs() {
      return this.columnsOrder;
    },
    getFormData() {
      return this.form;
    },
    setFormData(data) {
      this.form = {
        ...this.form,
        ...data,
      };
    },
    getInsertMode() {
      return this.insertMode;
    },
    setInsertMode(status) {
      this.insertMode = status;
    },
    getOverviewStatus() {
      return this.overview;
    },
    setOverviewStatus(status) {
      this.overview = status;
    },
    initializeCustomVariables() {
      const { customVariables } = this;
      this.setCustomVariables({ ...customVariables });
    },
    initializeFormData() {
      const { formInitialization } = this;
      this.form = formInitialization;
      console.log("Ibtialize Form Data");
      console.log(this.form);
    },
    calculatePageIndex() {
      const { pagination } = this;
      pagination.startIndex = pagination.limit * (pagination.skip - 1) + 1;
      if (pagination.limit * pagination.skip >= pagination.total) {
        pagination.endIndex = pagination.total;
      } else pagination.endIndex = pagination.limit * pagination.skip;
    },
  },
};
</script>