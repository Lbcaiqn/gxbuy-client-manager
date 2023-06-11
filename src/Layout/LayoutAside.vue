<script setup lang="ts">
import { useRouter } from "vue-router";
import { MenuStore, HeaderStore } from "@/store";

const router = useRouter();

const menuStore = MenuStore();
const headerStore = HeaderStore();

function menuItemClick(path: string, titleList: Array<string>) {
  headerStore.breadCrumb = titleList;
  router.push(path);
}
</script>

<template>
  <div id="layout-aside" v-if="menuStore.menuData.length !== 0">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      :collapse="menuStore.menuIsCollapse"
    >
      <p class="title">
        <span v-show="!menuStore.menuIsCollapse">聚享购商家后台管理系统</span>
        <el-button
          v-show="menuStore.menuIsCollapse"
          size="small"
          icon="view"
          circle
          color="#545c64"
          title="展开菜单"
          @click="menuStore.menuIsCollapse = !menuStore.menuIsCollapse"
        ></el-button>
      </p>

      <template v-for="(first, firstIndex) in menuStore.menuData" :key="firstIndex">
        <el-menu-item
          v-if="!first.children"
          :index="`${firstIndex + 1}`"
          @click="menuItemClick(first.path, [first.title])"
        >
          <el-icon><component :is="first.icon"></component></el-icon>
          <template #title>{{ first.title }}</template>
        </el-menu-item>

        <el-sub-menu v-else :index="String(firstIndex + 1)">
          <template #title>
            <el-icon><i-ep-user-filled></i-ep-user-filled></el-icon>
            <span>{{ first.title }}</span>
          </template>
          <el-menu-item
            v-for="(second, secondIndex) in first.children"
            :key="secondIndex"
            :index="`${firstIndex + 1}-${secondIndex + 1}`"
            @click="menuItemClick(second.path, [first.title, second.title])"
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
  background-color: #545c64;
  border-right: 2px solid #000;

  .title {
    height: 50px;
    width: 100%;
    line-height: 50px;
    text-align: center;
    color: #fff;
  }
}
</style>
