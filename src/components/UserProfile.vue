<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const router = useRouter();

const logoin = () => {
  isLogin.value = true;
  message.success("登录成功,2秒后跳转", 2);
  setTimeout(() => {
    router.push("/");
  }, 2000);
}

const logout = () => {
  isLogin.value = false;
  message.success("退出登录成功,2秒后跳转首页", 2);
  setTimeout(() => {
    router.push("/");
  }, 2000);
}
</script>

<template>
  <router-link to="#" @click="logoin" v-if="!isLogin">
    <div> <a-button type="primary" class="rounded-[2px]">登录</a-button></div>
  </router-link>
  <div v-else>
    <a-dropdown-button class="rounded-[2px]">
      <router-link to="/setting">user</router-link>
      <template v-slot:overlay>
        <a-menu class="rounded-[2px]">
          <a-menu-item key="0">
            创建作品
          </a-menu-item>
          <a-menu-item key="1">
            <router-link to="/works">我的作品</router-link>
          </a-menu-item>
          <a-menu-item key="2" @click="logout" class="logout">
            登出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<style scoped></style>
