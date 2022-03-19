import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'// 引入重置样式的包
import '@/assets/style/common.less'// 引入自定义 公共样式的包
import './mock'

// 导入自定义插件
import ui from './components/library'

// 创建一个vue应用实例
// 插件的使用，在main.js使用app.use(插件)
createApp(App).use(store).use(router).use(ui).mount('#app')
