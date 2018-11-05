import dataRenderTable from "./data-render-table";
const components = [dataRenderTable];

const install = function(Vue) {
  if (install.installed) return;
  components.map(components => Vue.component(components.name, components));
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  dataRenderTable
};
