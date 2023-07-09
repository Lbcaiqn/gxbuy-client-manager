<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    options: any;
  }>(),
  {
    width: 300,
    height: 200,
    options: () => {
      return {};
    }
  }
);

const echartsRef = ref<HTMLElement | null>(null);

onMounted(() => {
  echartsRef.value!.style.width = props.width + "px";
  echartsRef.value!.style.height = props.height + "px";

  const myChart = echarts.init(echartsRef.value!);
  myChart.setOption(props.options);
});
</script>

<template>
  <div ref="echartsRef"></div>
</template>
