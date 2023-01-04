import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import MapView from "@/views/MapView";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/map",
    name: "map",
    component: MapView,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
