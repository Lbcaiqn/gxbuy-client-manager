<script setup lang="ts">
import { ref } from "vue";
import MyEcharts from "@/components/common/MyEcharts.vue";

const props = withDefaults(
  defineProps<{
    chartData: Array<number>;
  }>(),
  {
    chartData: () => []
  }
);

const chartOptions = ref({
  title: {
    text: "销售额"
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    splitLine: {
      show: false
    },
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    axisLine: {
      show: true
    },
    axisTick: {
      show: true
    }
  },
  yAxis: {
    splitLine: {
      show: false
    },
    axisLine: {
      show: true
    },
    axisTick: {
      show: true
    }
  },
  grid: {
    left: 40,
    top: 0,
    right: 20,
    bottom: 20
  },
  series: [
    {
      type: "line",
      data: props.chartData,
      smooth: true,
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "red"
            },
            {
              offset: 1,
              color: "blue"
            }
          ],
          global: false
        }
      }
    }
  ]
});
</script>

<template>
  <div class="box5">
    <div class="title">
      <p>按月份总销售额统计</p>
      <img src="@/assets/img/common/dataScreen-title.png" alt="" />
    </div>

    <MyEcharts :options="chartOptions" :height="300" :width="1920" />
  </div>
</template>

<style lang="less" scoped>
.box5 {
  width: 1920px;
  height: 350px;
  background: url(@/assets/img/common/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;

  .title {
    padding: 20px 0 0 20px;
    m p {
      color: white;
      font-size: 20px;
    }
  }
}
</style>
