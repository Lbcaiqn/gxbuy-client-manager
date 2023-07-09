<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="less" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
