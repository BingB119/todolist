import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import axios from 'axios';

// 配置axios全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/json';

const app = createApp(App);
const pinia = createPinia();

// 全局挂载axios
app.config.globalProperties.$axios = axios;

app.use(pinia);
app.use(router);
app.mount('#app');