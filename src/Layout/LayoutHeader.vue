<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { HeaderStore, MenuStore, UserStore } from "@/store";
import NoneUserImg from "@/assets/img/none/none_user.jpg";
import router from "@/router";

const headerStore = HeaderStore();
const menuStore = MenuStore();
const userStore = UserStore();

// const baseURL = ref(
//   import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
// );

function collapseMenu() {
  menuStore.menuIsCollapse = !menuStore.menuIsCollapse;
}

function fullScreen() {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
}

async function logout() {
  localStorage.setItem("gxbuy_manager_user_store", "");
  localStorage.setItem("gxbuy_manager_menu_store", "");
  localStorage.setItem("gxbuy_manager_header_store", "");

  await router.push("/login");

  router.go(0);
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
          <el-breadcrumb-item v-for="(title, titleIndex) in headerStore.breadCrumb" :key="titleIndex">
            {{ title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operate">
      <div class="operate-btn">
        <el-button size="small" icon="FullScreen" circle @click="fullScreen" title="全屏"></el-button>
      </div>
      <div class="user-info">
        <el-image :src="userStore.userInfo.shop_manager_icon || NoneUserImg"></el-image>
        <el-dropdown>
          <span class="el-dropdown-link">
            <span>{{ userStore.userInfo.shop_manager_name }}</span>
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
</template>

<style lang="less" scoped>
#layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

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
