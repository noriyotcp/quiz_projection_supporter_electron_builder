import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import BootstrapVue from "bootstrap-vue";
import "bootstrap-honoka/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);

import electron from "electron";
Vue.prototype.$electron = electron;

Vue.config.productionTip = false;

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
