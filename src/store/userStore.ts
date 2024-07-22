import { defineStore } from "pinia";

interface User {
  isLogin: boolean
}

export const useUserStore = defineStore<string, User>("user", {
  state() {
    return {
      isLogin: false
    }
  },
})