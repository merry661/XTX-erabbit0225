import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'// 引入重置样式的包
import '@/assets/style/common.less'// 引入自定义 公共样式的包

// 创建一个vue应用实例
createApp(App).use(store).use(router).mount('#app')
