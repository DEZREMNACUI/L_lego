import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { pinia } from './store';

createApp(App).use(router).use(pinia).mount('#app');
