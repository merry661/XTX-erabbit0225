<template>
<!-- 一级路由布局容器 -->
<!-- 吸顶组件 -->
<AppHeaderSticky></AppHeaderSticky>

<!-- 顶部通栏 -->
<AppTopnav />

 <!-- 头部 -->
 <AppHeader />

  <main class="xtx-content">
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>

 <!-- 底部 -->
 <AppFooter></AppFooter>
</template>

<script>
// 导入子组件
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-stick.vue'

// 导入vuex
import { useStore } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    // 1.获取 全部分类数据
    const store = useStore()
    store.dispatch('category/getAllCategoryList')
  }
}
</script>

<style scoped lang='less'>
.xtx-content{
  min-height: 700px;
}
</style>
