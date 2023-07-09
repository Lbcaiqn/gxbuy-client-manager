<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { getSalesDataRequest } from "@/api";
import { myMessage } from "@/tools/myMessage";
import SalesDataTop from "./childrenComponent/SalesDataTop.vue";
import SeasonSales from "./childrenComponent/SeasonSales.vue";
import MonthCount from "./childrenComponent/MonthCount.vue";
import Sex from "./childrenComponent/Sex.vue";
import MonthSales from "./childrenComponent/MonthSales.vue";

const containerRef = ref<HTMLElement | null>(null);
const salesData = ref<any>({});

async function init() {
  try {
    salesData.value = (await getSalesDataRequest()).data;
  } catch (err: any) {
    myMessage(err, "error", true);
  }
}

init();

function windowResize() {
  if (!containerRef.value) return;

  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;

  containerRef.value.style.transform = `scale(${scaleX < scaleY ? scaleX : scaleY})`;
}

watch(
  () => containerRef.value,
  () => {
    if (containerRef.value) windowResize();
  }
);

onMounted(() => {
  window.addEventListener("resize", windowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", windowResize);
});
</script>

<template>
  <div id="sales-data" v-if="JSON.stringify(salesData) !== '{}'">
    <div class="container" ref="containerRef">
      <SalesDataTop />
      <div class="charts">
        <div class="top">
          <SeasonSales :chartData="salesData.seasonSales" />
          <MonthCount :chartData="salesData.monthCount" />
          <Sex :chartData="salesData.sex" />
        </div>

        <div class="bottom"><MonthSales :chartData="salesData.monthSales" /></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
#sales-data {
  height: 100vh;
  background: url("@/assets/img/common/salesData_background.png") no-repeat;
  background-size: 100% 100%;

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -960px;
    margin-top: -540px;
    width: 1920px;
    height: 1080px;

    .charts {
      .top {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 80px;
      }

      .bottom {
        margin-top: 80px;
      }
    }
  }
}
</style>
