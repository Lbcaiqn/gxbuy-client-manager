// /src/store/index.js
import { createPinia, defineStore } from "pinia";
import { MenuStoreStateInterface, UserStoreStateInterface } from "@/types";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { reactive, toRefs } from "vue";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const MenuStore = defineStore(
  "Menu",
  () => {
    const state = reactive<MenuStoreStateInterface>({
      defaultOpen: ["3"],
      defaultActive: "",
      menuIsCollapse: false,
      menuData: []
    });
    return {
      ...toRefs(state)
    };
  },
  {
    persist: { key: "gxbuy_manager_menu_store", storage: window.localStorage }
  }
);

export const UserStore = defineStore(
  "User",
  () => {
    const state = reactive<UserStoreStateInterface>({
      gxbuy_manager_jwt: "",
      userInfo: null,
      routesName: [],
      button: []
    });
    return {
      ...toRefs(state)
    };
  },
  {
    persist: { key: "gxbuy_manager_user_store", storage: window.localStorage }
  }
);

export default pinia;
