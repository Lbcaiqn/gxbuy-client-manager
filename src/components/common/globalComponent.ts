import SvgIcon from "./SvgIcon.vue";
import type { App, Component } from "vue";

// 准备注册的组件
const components: { [name: string]: Component } = { SvgIcon };

export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
  }
};
