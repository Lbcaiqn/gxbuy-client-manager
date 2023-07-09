<script setup lang="ts">
import { ref } from "vue";
import MyEcharts from "@/components/common/MyEcharts.vue";

const props = withDefaults(
  defineProps<{
    chartData: {
      man: number;
      woman: number;
    };
  }>(),
  {
    chartData: () => {
      return {
        man: 50,
        woman: 50
      };
    }
  }
);

const chartOptions = ref({
  title: {
    text: "客户男女比例",
    textStyle: {
      color: "skyblue"
    },
    left: "40%"
  },

  xAxis: {
    show: false,
    min: 0,
    max: 100
  },
  yAxis: {
    show: false,
    type: "category"
  },
  series: [
    {
      type: "bar",
      data: [props.chartData.man],
      barWidth: 20,
      z: 100,
      itemStyle: {
        color: "blue",
        borderRadius: 20
      }
    },
    {
      type: "bar",
      data: [100],
      barWidth: 20,

      barGap: "-100%",
      itemStyle: {
        color: "pink",
        borderRadius: 20
      }
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
  <div class="box1">
    <div class="title">
      <p>客户男女比例</p>
      <img src="@/assets/img/common/dataScreen-title.png" alt="" />
    </div>
    <div class="sex">
      <div class="man">
        <img src="@/assets/img/common/man.png" alt="" />
      </div>
      <div class="women">
        <img src="@/assets/img/common/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士{{ props.chartData.man }}%</p>
      <p>女士{{ props.chartData.woman }}%</p>
    </div>

    <MyEcharts style="margin: 0 auto" :options="chartOptions" :height="100" :width="500" />
  </div>
</template>

<style lang="less" scoped>
.box1 {
  width: 600px;
  height: 400px;
  background: url(@/assets/img/common/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin: 20px 0 0 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }

  .sex {
    display: flex;
    justify-content: center;
    margin-top: 50px;

    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(@/assets/img/common/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(@/assets/img/common/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    color: white;
  }
}
</style>
