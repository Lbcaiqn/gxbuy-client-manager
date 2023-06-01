<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { UserStore } from "@/store";
import { userLoginRequest } from "@/api/request/user";
import { myMessage } from "@/tools/myMessage.ts";
import { addAuthRoutes } from "@/router/authRoutes";
import type { FormInstance, FormRules } from "element-plus";

const router = useRouter();
const userStore = UserStore();

const loginFormRef = ref<FormInstance>();

const loginInfo = reactive({
  shopAccount: "00000001",
  shopPassword: "qwer1234",
  userAccount: "admin",
  userPassword: "qwer1234"
});

// 检验规则
function validateShopAccount(rule: any, value: any, callback: any) {
  if (!rule) return;

  if (value === "") {
    callback(new Error("商家账号不能为空"));
  } else {
    if (!loginFormRef.value) return;
    callback();
  }
}

function validateShopPassword(rule: any, value: any, callback: any) {
  if (!rule) return;

  if (value === "") {
    callback(new Error("商家密码不能为空"));
  } else {
    if (!loginFormRef.value) return;
    callback();
  }
}

function validateUserAccount(rule: any, value: any, callback: any) {
  if (!rule) return;

  if (value === "") {
    callback(new Error("管理者账号不能为空"));
  } else {
    if (!loginFormRef.value) return;
    callback();
  }
}

function validateUserPassword(rule: any, value: any, callback: any) {
  if (!rule) return;

  if (value === "") {
    callback(new Error("管理者密码不能为空"));
  } else {
    if (!loginFormRef.value) return;
    callback();
  }
}

// 整合检验规则
const rules = reactive<FormRules>({
  shopAccount: [{ validator: validateShopAccount, trigger: "blur" }],
  shopPassword: [{ validator: validateShopPassword, trigger: "blur" }],
  userAccount: [{ validator: validateUserAccount, trigger: "blur" }],
  userPassword: [{ validator: validateUserPassword, trigger: "blur" }]
});

// 登录
const isLogining = ref(false);

function login(formEl: FormInstance | undefined) {
  if (!formEl) return;

  formEl.validate(async (valid: any) => {
    if (!valid) return;

    isLogining.value = true;

    try {
      const res = (await userLoginRequest(loginInfo)).data;

      userStore.gxbuy_manager_jwt = res.jwt;
      userStore.userInfo = res.userInfo;
      userStore.routesName = res.routesName;

      await addAuthRoutes(userStore.routesName);
      router.push("/home");
    } catch (err: any) {
      myMessage(err, "error", true);
    }

    isLogining.value = false;
  });
}

// 全屏
function fullScreen() {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
}
</script>

<template>
  <div id="login">
    <div class="login-container">
      <p class="login-title">用户登录</p>
      <el-form
        ref="loginFormRef"
        :model="loginInfo"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item class="form-item" prop="shopAccount">
          <template #label>
            <p class="label">
              <el-icon class="label" :size="30"><Connection /></el-icon>
            </p>
          </template>
          <template #error="{ error }">
            <p class="error">{{ error }}</p>
          </template>
          <el-input
            v-model="loginInfo.shopAccount"
            type="text"
            placeholder="请输入商家账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item class="form-item" prop="shopPassword">
          <template #label>
            <p class="label-bex">
              <el-icon class="label" :size="30"><Lock /></el-icon>
            </p>
          </template>
          <template #error="{ error }">
            <p class="error">{{ error }}</p>
          </template>
          <el-input
            v-model="loginInfo.shopPassword"
            type="password"
            placeholder="请输入商家密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item class="form-item" prop="userAccount">
          <template #label>
            <p class="label-bex">
              <el-icon class="label" :size="30"><User /></el-icon>
            </p>
          </template>
          <template #error="{ error }">
            <p class="error">{{ error }}</p>
          </template>
          <el-input
            v-model="loginInfo.userAccount"
            type="text"
            placeholder="请输入管理者账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item class="form-item" prop="userPassword">
          <template #label>
            <p class="label-bex">
              <el-icon class="label" :size="30"><Lock /></el-icon>
            </p>
          </template>
          <template #error="{ error }">
            <p class="error">{{ error }}</p>
          </template>
          <el-input
            v-model="loginInfo.userPassword"
            type="password"
            placeholder="请输入管理者密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-button type="primary" :loading="isLogining" @click="login(loginFormRef)">
          {{ !isLogining ? "登录" : "登录中..." }}
        </el-button>
      </el-form>
    </div>

    <div class="operate">
      <el-button size="large" icon="FullScreen" color="rgba(0,0,0,0.5)" circle @click="fullScreen"></el-button>
    </div>
  </div>
</template>

<style scoped lang="less">
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("@/assets/img/common/background_img.jpg") no-repeat;
  background-size: 100% 100%;

  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 700px;
    height: 500px;
    background-color: #fff;
    border-radius: 50px;

    .login-title {
      margin-bottom: 50px;
      font-size: 35px;
      font-weight: bold;
    }
    .form-item {
      margin-bottom: 28px;
      width: 300px;
      height: 35px;
      border: 1px solid #000;

      .label {
        margin-left: -105px;
        height: 35px;
        line-height: 35px;
      }

      .error {
        margin-left: -86px;
      }
    }

    :deep(input) {
      margin-left: -100px;
    }

    button {
      width: 300px;
    }
  }

  .operate {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
