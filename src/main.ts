import { createApp } from "vue";
import "@/assets/style/global.less";
import "virtual:svg-icons-register";
import gloablComponent from "./components/common/globalComponent";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import { authBtn } from "./directives/authBtn";
import router from "./router";
import store from "./store";
import App from "./App.vue";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(gloablComponent).use(router).use(store).use(ElementPlus).mount("#app");

authBtn(app);
