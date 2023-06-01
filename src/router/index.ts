import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homeDefaultRoute",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home/Home.vue"),
    meta: {
      useLayout: true,
      jwt: true,
      menuData: {
        title: "首页",
        icon: "home-filled"
      }
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/Login.vue"),
    meta: {
      useLayout: false,
      jwt: false
    }
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/404/404.vue"),
    meta: {
      useLayout: false,
      jwt: false
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (!from) return;

  if (to.meta.jwt && !JSON.parse(localStorage.getItem("gxbuy_manager_user_store") || "null")?.gxbuy_manager_jwt) {
    next({
      path: "/login",
      query: { toPath: to.fullPath }
    });
  } else if (
    to.name === "login" &&
    JSON.parse(localStorage.getItem("gxbuy_manager_user_store") || "null")?.gxbuy_manager_jwt
  ) {
    next("/home");
  } else next();
});

export default router;
