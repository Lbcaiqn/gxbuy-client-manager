import { createApp } from "vue";
import "@/assets/style/global.less";
import "virtual:svg-icons-register";
import gloablComponent from "./components/common/globalComponent";
import App from "./App.vue";

createApp(App).use(gloablComponent).mount("#app");
