<template>
<!-- 一级路由布局容器 -->
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
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  name: 'Layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped lang='less'>
.xtx-content{
  min-height: 600px;
}
</style>
