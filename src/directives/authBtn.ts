import { DirectiveBinding } from "vue";
import { UserStore } from "@/store";

export function authBtn(app: any) {
  app.directive("authBtn", {
    mounted(el: HTMLElement, dir: DirectiveBinding) {
      const userStore = UserStore();
      if (!userStore.button.includes(dir.value)) el.parentNode?.removeChild(el);
    }
  });
}
