<script setup lang="ts">
import { ref } from "vue";
import MyEcharts from "@/components/common/MyEcharts.vue";

const props = withDefaults(
  defineProps<{
    chartData: Array<number>;
  }>(),
  { chartData: () => [] }
);

const chartOptions = ref({
  title: {
    text: "销量",
    left: "50%",
    textStyle: {
      color: "yellowgreen",
      fontSize: 20
    }
  },
  xAxis: {
    type: "category"
  },
  yAxis: {},
  grid: {
    left: 20,
    bottom: 20,
    right: 20
  },
  series: [
    {
      type: "bar",
      data: props.chartData,
      label: {
        show: true,
        position: "insideTop",
        color: "yellowgreen"
      },
      showBackground: true,
      backgroundStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "black"
            },
            {
              offset: 1,
              color: "blue"
            }
          ],
          global: false
        }
      },

      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: function (data: any) {
          const arr = [
            "red",
            "orange",
            "yellowgreen",
            "green",
            "purple",
            "hotpink",
            "skyblue",
            "blue",
            "gray",
            "white",
            "orange",
            "yellow"
          ];
          return arr[data.dataIndex];
        }
      }
    },
    {
      type: "line",
      data: props.chartData,
      smooth: true
    },
    {
      type: "bar",
      data: props.chartData,
      label: {
        show: true,
        position: "insideTop",
        color: "yellowgreen"
      },
      showBackground: true,
      backgroundStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "black"
            },
            {
              offset: 1,
              color: "blue"
            }
          ],
          global: false
        }
      },
      itemStyle: {
        borderRadius: [10, 10, 0, 0],
        color: function (data: any) {
          const arr = [
            "red",
            "orange",
            "yellowgreen",
            "green",
            "purple",
            "hotpink",
            "skyblue",
            "blue",
            "gray",
            "white",
            "orange",
            "yellow"
          ];
          return arr[data.dataIndex];
        }
      }
    }
  ],
  tooltip: {
    backgroundColor: "rgba(50,50,50,0.7)"
  }
});
</script>

<template>
  <div class="box6">
    <div class="title">
      <p>按月份总销量统计</p>
      <img src="@/assets/img/common/dataScreen-title.png" alt="" />
    </div>

    <MyEcharts :options="chartOptions" :height="350" :width="600" />
  </div>
</template>

<style lang="less" scoped>
.box6 {
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
