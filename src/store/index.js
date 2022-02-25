import { createStore } from 'vuex'

// 导入vuex-persistedstate插件
import createPersistedstate from 'vuex-persistedstate'

// 导入各个模块
import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

export default createStore({ // 创建vuex仓库并导出
  state: {// 数据
  },
  mutations: {// 改数据 函数
  },
  actions: {// 请求数据 函数
  },
  modules: { // 分模块
    user,
    cart,
    category
  },
  getters: {// vuex的计算属性

  },
  // 使用vuex-persistedstate插件 进行数据持久化
  // 默认是存储在localStorage中，修改state后触发才可以看到本地存储数据的的变化
  // key:存储数据的键名，paths：state中的那些数据
  plugins: [
    // 默认存储在localStorage
    createPersistedstate({
      // 本地存储名字
      key: 'erabbit-client-pc-124-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
