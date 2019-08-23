import Vue from "vue";
import Router from "vue-router";
import MainScreen from "./views/MainScreen.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "main-screen",
      component: MainScreen
    },
    {
      path: "/projection",
      name: "projection",
      // route level code-splitting
      // this generates a separate chunk (projection.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function() {
        return import(
          /* webpackChunkName: "projection" */ "./views/ProjectionScreen.vue"
        );
      }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
