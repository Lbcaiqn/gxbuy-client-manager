<script setup lang="ts">
import LayoutAside from "./LayoutAside.vue";
import LayoutHeader from "./LayoutHeader.vue";
import LayoutMain from "./LayoutMain.vue";
import { useRoute, useRouter } from "vue-router";
import { MenuStore, UserStore } from "@/store";
import { getUserInfoRequest } from "@/api";
import { addAuthRoutes } from "@/router/authRoutes";
import { myMessage } from "@/tools/myMessage";

const route = useRoute();
const router = useRouter();
const menuStore = MenuStore();
const userStore = UserStore();

async function init() {
  if (userStore.gxbuy_manager_jwt) {
    try {
      const res = (await getUserInfoRequest()).data;

      userStore.userInfo = res.userInfo;
      userStore.routesName = res.routesName;
      userStore.button = res.buttons;

      await addAuthRoutes(userStore.routesName);

      // 没有添加路由前会跳转到404，所以添加完路由后要跳转一下
      router.push(route.fullPath);
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  }
}

init();
</script>

<template>
  <router-view v-if="!$route.meta.useLayout"></router-view>
  <div v-else class="pc-center">
    <el-container style="height: 100vh">
      <el-aside class="layout-aside" :width="menuStore.menuIsCollapse ? '66px' : '200px'">
        <el-scrollbar>
          <LayoutAside></LayoutAside>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="layout-header" height="50px">
          <LayoutHeader></LayoutHeader>
        </el-header>
        <el-main class="layout-main">
          <el-scrollbar>
            <LayoutMain></LayoutMain>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.pc-center {
  border: 1px solid #000;
  .layout-aside,
  .layout-header,
  .layout-main {
    transition: all 0.3s;
  }
}
</style>
