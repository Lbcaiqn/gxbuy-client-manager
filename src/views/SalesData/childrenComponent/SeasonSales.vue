<script setup lang="ts">
import { ref } from "vue";
import MyEcharts from "@/components/common/MyEcharts.vue";

const props = withDefaults(defineProps<{ chartData: Array<string> }>(), {
  chartData: () => []
});

const chartOptions = ref({
  tooltip: {
    trigger: "item"
  },
  legend: {
    right: 30,
    top: 40,
    orient: "vertical",
    textStyle: {
      color: "white",
      fontSize: 14
    }
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: true,
        position: "inside",
        color: "white"
      },

      labelLine: {
        show: false
      },
      data: props.chartData
    }
  ],

  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
});
</script>

<template>
  <div class="box2">
    <div class="title">
      <p>按季度总销量统计</p>
      <img src="@/assets/img/common/dataScreen-title.png" alt="" />
    </div>

    <MyEcharts :options="chartOptions" :height="300" :width="600" />
  </div>
</template>

<style lang="less" scoped>
.box2 {
  width: 600px;
  height: 400px;
  background: url(@/assets/img/common/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .title {
    margin: 20px 0 0 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }
}
</style>
