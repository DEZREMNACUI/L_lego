import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("../views/index.vue")
    },
    {
      path: "/editor/:id",
      name: "editor",
      component: () => import("../views/Editor.vue")
    }
  ]
});