// /src/store/index.js
import { createPinia, defineStore } from "pinia";
import { MenuStoreStateInterface, HeaderStoreStateInterface, UserStoreStateInterface } from "@/types";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const MenuStore = defineStore(
  "Menu",
  () => {
    const state = reactive<MenuStoreStateInterface>({
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

export const HeaderStore = defineStore(
  "Header",
  () => {
    const state = reactive<HeaderStoreStateInterface>({
      breadCrumb: ["首页"]
    });

    return {
      ...toRefs(state)
    };
  },
  {
    persist: { key: "gxbuy_manager_header_store", storage: window.localStorage }
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
