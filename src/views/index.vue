<script setup lang="ts">
import UserProfile from '../components/UserProfile.vue';

</script>

<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header flex justify-between items-center">
        <div class="page-title text-[#fff]">
          <router-link to="/">L_lego</router-link>
        </div>
        <user-profile/>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="flex justify-center">
        <p>L_lego版权所有</p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped></style>
