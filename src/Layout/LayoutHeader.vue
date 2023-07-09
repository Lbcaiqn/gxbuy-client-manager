<script setup lang="ts">
import { ref } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { ArrowRight } from "@element-plus/icons-vue";
import { MenuStore, UserStore } from "@/store";
import NoneUserImg from "@/assets/img/none/none_user.jpg";
import router from "@/router";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const menuStore = MenuStore();
const userStore = UserStore();

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

function collapseMenu() {
  menuStore.menuIsCollapse = !menuStore.menuIsCollapse;
}

function fullScreen() {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
}

async function logout() {
  localStorage.setItem("gxbuy_manager_user_store", "");
  localStorage.setItem("gxbuy_manager_menu_store", "");

  await router.push("/login");

  router.go(0);
}

const showDrawer = ref(false);
const btnColor = ref("#409eff");

function changeBtnColor(color: string) {
  const html = document.documentElement;
  html.style.setProperty("--el-color-primary", color);
  showDrawer.value = false;
}
</script>

<template>
  <div id="layout-header">
    <div class="title">
      <div class="title-icon">
        <el-button
          class="btn"
          v-show="!menuStore.menuIsCollapse"
          size="small"
          icon="hide"
          circle
          title="收起菜单"
          @click="collapseMenu"
        ></el-button>
      </div>

      <div class="title-text">
        <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
          <el-breadcrumb-item v-for="(title, titleIndex) in $route.matched" :key="titleIndex" :to="title.path">
            {{ (title.meta?.menuData as any)?.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operate">
      <div class="operate-btn">
        <el-button size="small" icon="SuitcaseLine" circle title="皮肤" @click="showDrawer = true"></el-button>
        <el-button v-show="isDark" size="small" icon="Sunny" circle @click="toggleDark()" title="日间模式"></el-button>
        <el-button v-show="!isDark" size="small" icon="Moon" circle @click="toggleDark()" title="夜间模式"></el-button>
        <el-button size="small" icon="FullScreen" circle @click="fullScreen" title="全屏"></el-button>
      </div>
      <div class="user-info">
        <el-image
          :src="userStore.userInfo?.shop_manager_icon ? baseURL + userStore.userInfo?.shop_manager_icon : NoneUserImg"
        ></el-image>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>{{ userStore.userInfo?.shop_manager_name }}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>

  <el-drawer v-model="showDrawer" title="皮肤" :with-header="false">
    <div style="display: flex; align-items: center">
      <span>按钮主推：</span>
      <el-color-picker v-model="btnColor" @change="changeBtnColor" />
    </div>
  </el-drawer>
</template>

<style lang="less" scoped>
#layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid gray;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;

    .title-icon .btn {
      margin-right: 10px;
    }

    .title-text .breadcrumb {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
    }
  }

  .operate {
    display: flex;

    .operate-btn {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      margin-left: 20px;

      :deep(img) {
        margin-right: 10px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
      }
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
