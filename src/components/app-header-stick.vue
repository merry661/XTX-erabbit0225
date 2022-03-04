<template>
<!-- 吸顶组件 -->
  <div class="app-header-sticky" :class="{show:y>=78}">
    <div class="container" :class="{show:y>=78}">
        <!-- 左侧logol -->
      <RouterLink class="logo" to="/" />
        <!-- 中间内容 -->
      <AppHeaderNav />

        <!-- 右侧两栏 -->
      <div class="right">
        <RouterLink to="/" >品牌</RouterLink>
        <RouterLink to="/" >专题</RouterLink>
      </div>

    </div>
  </div>
</template>
<script>
// 引入二级标题组件
import AppHeaderNav from './app-header-nav'
// 引入vue 钩子函数,ref
// import { onMounted, ref } from 'vue'
import { useWindowScroll } from '@vueuse/core'
export default {
  name: 'AppHeaderSticky',
  components: {
    AppHeaderNav
  },
  setup () {
    // const y = ref(0)
    // onMounted(() => {
    //   // 组件渲染后，监听页面滚动距离超过78px隐藏
    //   window.onscroll = () => {
    //     // console.log(document.documentElement)//返回<html>

    //     const scrollTop = document.documentElement.scrollTop
    //     y.value = scrollTop
    //   }
    // })
    const { y } = useWindowScroll()// 返回当前页面滚动时候蜷曲的距离
    return { y }
  }
}
</script>

<style scoped lang="less">
.app-header-sticky {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;

// 隐藏吸顶组件
  transform: translateY(-100%);//向上滚动自身高度
  opacity: 0;//透明
  &.show{
    //显示吸顶组件
      transition: all 0.3s linear;//线性动画效果:所有属性都过渡,过渡时间,速度
      transform: none;//不向上滚动,留在原地
      opacity: 1;//不透明
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat  right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>
