<script setup lang="ts">
import { ref } from "vue";
import { UserStore } from "@/store";
import NoneUserImg from "@/assets/img/none/none_user.jpg";

const userStore = UserStore();

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);
</script>

<template>
  <div>
    <el-card>
      <div class="user">
        <div class="user-img">
          <img
            :src="userStore.userInfo?.shop_manager_icon ? baseURL + userStore.userInfo?.shop_manager_icon : NoneUserImg"
          />
        </div>
        <div class="user-info">
          <p>{{ userStore.userInfo?.shop_manager_name }}</p>
          <p>
            <span>角色：</span>
            <span v-if="!userStore.userInfo?.shop_manager_role?.length">暂无</span>
            <span v-for="i in userStore.userInfo?.shop_manager_role" :key="i.id">
              {{ i.shop_manager_role_name + " " }}
            </span>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.user {
  display: flex;
  align-items: center;
  height: 300px;
  .user-img {
    height: 200px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 150px;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 50px;
    height: 120px;

    p:first-child {
      font-size: 30px;
    }

    p:nth-child(2) {
      span {
        font-size: 30px;
      }
    }
  }
}
</style>
