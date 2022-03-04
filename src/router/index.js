
import { createRouter, createWebHashHistory } from 'vue-router'
import TopCategory from '@/views/category/index'
import SubCategory from '@/views/category/sub'
// 导入组件
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
// 配置路由规则
const routes = [ // 一级路由布局容器
  {
    path: '/',
    component: Layout,

    children: [ // 二级路由布局容器
      {
        path: '/',
        component: Home
      },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory }
    ]
  }
]
// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用hash方式创建路由
  routes// 配置路由规则
})

export default router
