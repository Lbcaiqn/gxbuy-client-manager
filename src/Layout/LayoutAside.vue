<script setup lang="ts">
import { ref } from "vue";
import { onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { MenuStore, UserStore } from "@/store";
import NoneUserImg from "@/assets/img/none/none_user.jpg";

const router = useRouter();

const menuStore = MenuStore();
const userStore = UserStore();

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

function menuItemClick(e: any, path: string) {
  menuStore.defaultActive = e.index;
  router.push(path);
}

function menuOpen(index: string) {
  if (!menuStore?.defaultOpen) {
    menuStore.defaultOpen = [index];
    return;
  }

  const value = menuStore.defaultOpen.indexOf(index);

  if (value === -1) menuStore.defaultOpen.push(index);
}

function menuClose(index: string) {
  if (!menuStore?.defaultOpen) {
    menuStore.defaultOpen = [];
    return;
  }

  const value = menuStore.defaultOpen.indexOf(index);

  if (value !== -1) menuStore.defaultOpen.splice(value, 1);
}

function minCollapse() {
  if (window.innerWidth <= 1200) menuStore.menuIsCollapse = true;
}

onMounted(() => {
  minCollapse();
  window.addEventListener("resize", minCollapse);
});

onBeforeMount(() => {
  window.removeEventListener("resize", minCollapse);
});
</script>

<template>
  <div id="layout-aside" v-if="menuStore.menuData.length !== 0">
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="menuStore.defaultActive || ''"
      :default-openeds="menuStore.defaultOpen || []"
      text-color="#fff"
      active-text-color="#ffd04b"
      background-color="#121212"
      :collapse="menuStore.menuIsCollapse"
      @open="menuOpen"
      @close="menuClose"
    >
      <div class="title">
        <div v-show="!menuStore.menuIsCollapse">
          <div>
            <img
              :src="userStore.userInfo?.shop?.shop_logo ? baseURL + userStore.userInfo?.shop?.shop_logo : NoneUserImg"
            />
          </div>
          <div style="font-size: 20px">{{ userStore.userInfo?.shop?.shop_name }}</div>
        </div>
        <el-button
          v-show="menuStore.menuIsCollapse"
          style="margin-left: 3px"
          size="small"
          icon="view"
          circle
          color="#121212"
          title="展开菜单"
          @click="menuStore.menuIsCollapse = !menuStore.menuIsCollapse"
        ></el-button>
      </div>

      <template v-for="(first, firstIndex) in menuStore.menuData" :key="firstIndex">
        <el-menu-item v-if="!first.children" :index="`${firstIndex + 1}`" @click="menuItemClick($event, first.path)">
          <el-icon><component :is="first.icon"></component></el-icon>
          <template #title>{{ first.title }}</template>
        </el-menu-item>

        <el-sub-menu v-else :index="String(firstIndex + 1)">
          <template #title>
            <el-icon><component :is="first.icon"></component></el-icon>
            <span>{{ first.title }}</span>
          </template>
          <el-menu-item
            v-for="(second, secondIndex) in first.children"
            :key="secondIndex"
            :index="`${firstIndex + 1}-${secondIndex + 1}`"
            @click="menuItemClick($event, second.path)"
          >
            <el-icon><Component :is="second.icon"></Component></el-icon>
            <template #title>{{ second.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<style lang="less" scoped>
#layout-aside {
  height: 100vh;
  background-color: #121212;
  border-right: 2px solid #121212;

  .title {
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
    color: #fff;

    > div {
      display: flex;
      align-items: center;
      margin-left: 18px;

      > div:first-child {
        margin-right: 10px;
        width: 28px;
        height: 28px;
        line-height: 28px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 14px;
        }
      }
    }
  }
}
</style>
