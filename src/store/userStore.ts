import { defineStore } from "pinia";

export interface User {
  isLogin: boolean
}

export const useUserStore = defineStore<string, User>("user", {
  state() {
    return {
      isLogin: false
    }
  },
})