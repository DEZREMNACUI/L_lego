import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { pinia } from './store';
import LBricks from "lego-bricks"

createApp(App).use(LBricks).use(router).use(pinia).mount('#app');
