<template>
  <div class="table-extend">
    <el-form ref="form" v-if="show.searchShow" :model="form" v-on="formConfig.$listener"  v-bind="formConfig.$attr">
        <div class="__table-extend_search_wrapper">
            <div class="__table-extend_search_content" :style="{flex:searchConfig.flex}">
                <div v-for="({prop,method,span,labelWidth,label,$attr,$listener},index) in formItem" :key="index" :style="{flex:span}">
                    <el-form-item :label-width="labelWidth" :label="label" :prop="prop">
                        <slot :name="`search-${prop}`" v-bind="form[prop]">
                            <el-input v-if="method === 'input'" v-model.trim="form[prop]" v-on="$listener" v-bind="$attr" style="width:100%"/>
                            <lxt-select v-else-if="method === 'select'" :value.sync="form[prop]" v-on="$listener" v-bind="$attr" style="width:100%"/>
                            <cascader v-else-if="method === 'cascader'" :value.sync="form[prop]" v-on="$listener" v-bind="$attr" style="width:100%"/>
                            <date-picker v-else-if="method === 'datePicker'" :value.sync="form[prop]" v-on="$listener" v-bind="$attr" style="width:100%"/>
                            <date-picker-custom v-else-if="method === 'datePickerCustom'" :value.sync="form[prop]" v-on="$listener" v-bind="$attr"/>
							<custom-hour-min v-else-if="method === 'customHourMin'" :value.sync="form[prop]" v-on="$listener" v-bind="$attr"/>
                        </slot>
                    </el-form-item>
            </div>
        </div>
        <div class="__table-extend_search_btn">
            <el-button type="primary" @click="searchHandle(form)" round>搜索</el-button>
            <el-button type="primary" v-if="searchConfig.resetButton" @click="resetHandle" plain round>重置</el-button>
        </div>
        </div>
    </el-form>
    <slot class="__middle_search_table_slot" name="middle" v-bind="{form:request, table:tableCache.data}"></slot>
    <div class="__table-extend_table_layout" v-loading="loading">
        <div  class="__middle_search_table">
            <span v-if="show.paginationShow">共查询到{{tableCache.total}}个结果</span>
            <div class="__middle_search_table_slot">
                <slot v-bind="{form:request, table:tableCache.data}"></slot>
            </div>
        </div>
        <div v-if="show.tableShow" class="__table-extend_table_wrapper">
            <el-table :data="tableCache.data" v-on="table.$listener" v-bind="table.$attr" style="width: 100%">
            <el-table-column :header-align="table.$attr.headerAlign" v-for="({$attr,$listener},index) in column" :key="index" show-overflow-tooltip v-on="$listener" v-bind="$attr">
                <template slot-scope="scope">
                <slot :name="`table-${$attr.prop}`" v-bind="{scope,form:request}">
                    {{$attr.type === 'index'? scope.$index+1:scope.row[$attr.prop]}}
                </slot>
                </template>
            </el-table-column>
            </el-table>
        </div>
            <div v-if="show.paginationShow" class="__table-extend_pagination_wrapper">
                <el-pagination  :total="tableCache.total" :current-page.sync="pageParams.pageNo" :page-size="pageParams.pageSize"  v-on="pagination.$listener" v-bind="pagination.$attr" @current-change="currentChange" @size-change="sizeChange">
                    <slot name="pagination"></slot>
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import debounce from "lodash/debounce";
// import cloneDeep from "lodash/cloneDeep";
import LxtSelect from "./script/select";
import Cascader from "./script/cascader";
import DatePicker from "./script/datePicker";
import DatePickerCustom from "./script/datePickerCustom";
import CustomHourMin from "./script/customHourMin";
import {
  getHandle,
  flatData,
  requestStrategy,
  mergeInitConfig,
  structuralClone
} from "./utils";
import init from "./initConfig";
import { isArray } from "./dataType";

export default {
  name: "ElExtendDataRenderTable",
  data() {
    return {
      loading: false,
      tableCache: {},
      searchConfig: {},
      onceSreach: [],
      form: {},
      initForm: {},
      pageInitParams: {},
      pageParams: {},
      request: {},
      requestStrategy: "",
      show: {
        searchShow: false,
        tableShow: false,
        paginationShow: false
      },
      formConfig: "",
      formItem: "",
      column: "",
      table: "",
      pagination: ""
    };
  },
  props: {
    api: Array,
    config: Object,
    auto: {
      type: Boolean,
      default: true
    }
  },
  components: {
    LxtSelect,
    DatePicker,
    DatePickerCustom,
    CustomHourMin,
    Cascader
  },
  created() {
    this.mergeConfig();
    this.$root.$on("elDateFrom", params => {
      this.form = { ...this.form, ...params };
    });
  },
  mounted() {
    if (this.auto) {
      this.searchHandle(this.form);
    }
  },
  methods: {
    insertHandler(...arg) {
      const [insertForm, ...onceSreach] = arg;
      this.onceSreach = onceSreach;
      this.form = { ...insertForm };
      this.searchHandle(this.form);
    },
    insertHandlerNotRefresh() {
      this.debounce(this.request);
    },
    async beforeSearchhandler(form) {
      let request = null;
      this.tableCache = {};
      this.resetCurrentPageAndPageSize();
      request = await this.mergeStrategiesFn(form);
      // request = await this.camelCaseToUnderline(request);
      return request;
    },
    async camelCaseToUnderline(form) {
      const obj = {};
      for (const item of Object.keys(form)) {
        obj[item.replace(/([A-Z])/g, "_$1").toLowerCase()] = form[item];
      }
      return obj;
    },
    async afterSearchhandler() {
      await this.unbindForm();
    },
    async unbindForm() {
      this.onceSreach.forEach(i => delete this.form[i]);
    },
    async searchHandle(form) {
      if (this.loading) return;
      let request = null;
      request = await this.beforeSearchhandler(form);
      if (this.auto) {
        this.request = { ...request, ...this.pageParams };
      } else {
        this.request = { ...request };
      }
      await this.debounce(this.request);
      await this.afterSearchhandler();
    },
    async mergeStrategiesFn(form) {
      let request = {};
      for (const i of Object.keys(form)) {
        if (isArray(form[i])) {
          request = {
            ...request,
            ...(this.requestStrategy[i] && this.requestStrategy[i](form[i]))
          };
        } else {
          request[i] = this.requestStrategy[i]
            ? this.requestStrategy[i](form[i])
            : form[i];
        }
      }
      return request;
    },
    async resetHandle() {
      if (this.loading) return;
      this.$emit("resetHandler");
      this.form = { ...this.initForm };
      if (this.auto) {
        await this.searchHandle(this.form);
      }
    },
    loadingSwitch() {
      this.loading = !this.loading;
    },
    resetCurrentPageAndPageSize() {
      this.pageParams = { ...this.pagination.pageParams };
    },
    async currentChange(pageNo) {
      this.pageParams = { ...this.pageParams, pageNo };
      await this.debounce({ ...this.request, ...this.pageParams });
    },
    async sizeChange(pageSize) {
      this.pageParams = { ...this.pageParams, pageSize };
      await this.debounce({ ...this.request, ...this.pageParams });
    },
    async getData(params) {
      this.loadingSwitch();
      const { handle, path } = getHandle(this.api);
      try {
        const data = await handle(params);
        this.tableCache = flatData(path, data);
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingSwitch();
      }
    },
    debounce: debounce(function(params) {
      this.getData(params);
    }, 300),
    async mergeConfig() {
      const initClone = await structuralClone(init);
      const mergedConfig = mergeInitConfig(initClone, this.config);
      const { merge, form } = requestStrategy(
        mergedConfig.searchConfig.formItem
      );
      this.requestStrategy = merge;
      this.form = { ...form };
      this.initForm = { ...form };
      this.show = {
        searchShow: mergedConfig.searchConfig.searchShow,
        tableShow: mergedConfig.tableConfig.tableShow,
        paginationShow: mergedConfig.pagination.paginationShow
      };
      this.searchConfig = mergedConfig.searchConfig;
      this.formConfig = mergedConfig.searchConfig.form;
      this.formItem = mergedConfig.searchConfig.formItem;
      this.column = mergedConfig.tableConfig.column;
      this.table = mergedConfig.tableConfig.table;
      this.pagination = mergedConfig.pagination;
      if (!this.show.paginationShow) return;
      this.pageParams = { ...this.pagination.pageParams };
    }
  }
};
</script>

