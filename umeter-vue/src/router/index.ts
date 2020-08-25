import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from "../views/home/Home.vue";
import Splash from "../views/splash/Splash.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {path: "/", component: Splash},
  {path: "/home", component: Home},
]

const router = new VueRouter({
  // mode: 'history',
  base: "/",
  routes
})

export default router
