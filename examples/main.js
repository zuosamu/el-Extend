import Vue from "vue";
import App from "./App.vue";

import Samu from "./../packages/index";

Vue.config.productionTip = false;

Vue.use(Samu);

new Vue({
  render: h => h(App)
}).$mount("#app");
