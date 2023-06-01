import { createApp } from "vue";
import "@/assets/style/global.less";
import "virtual:svg-icons-register";
import gloablComponent from "./components/common/globalComponent";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(gloablComponent).use(router).use(store).mount("#app");
