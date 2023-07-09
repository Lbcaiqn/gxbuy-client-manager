<script setup lang="ts"></script>

<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="$router.push('/home')">首页</span>
    </div>
    <div class="center">
      <div class="title">销售数据</div>
    </div>
    <div class="right">
      <span class="rbtn" @click="$router.push('/goodsManage')">商品管理</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.top {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1.5;
    background: url(@/assets/img/common/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;

    .lbtn {
      width: 150px;
      height: 40px;
      float: right;
      background: url(@/assets/img/common/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
  }

  .center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      background: url(@/assets/img/common/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .right {
    flex: 1.5;
    background: url(@/assets/img/common/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 150px;
      height: 40px;
      background: url(@/assets/img/common/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }

    .time {
      color: #29fcff;
      font-size: 20px;
    }
  }
}
</style>
