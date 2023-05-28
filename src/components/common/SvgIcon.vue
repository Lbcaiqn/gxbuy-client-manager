<script setup lang="ts">
withDefaults(
  defineProps<{
    prefix: string; // xlink:href属性值的前缀
    name: string; // svg矢量图的名字
    color: string;
    width: string;
    height: string;
  }>(),
  {
    prefix: "#icon-",
    name: "",
    color: "#000",
    width: "16px",
    height: "16px"
  }
);
</script>

<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>
