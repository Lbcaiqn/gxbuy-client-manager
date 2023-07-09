<script setup lang="ts"></script>

<template>
  <div>
    <p>404 Not Found</p>
    <div class="btn">
      <el-button type="primary" size="large" @click="$router.replace('/home')">前往首页</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
p {
  margin-top: 100px;
  text-align: center;
  font-weight: bold;
  font-size: 50px;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
</style>
