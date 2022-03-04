<template>
    <!-- 首页-广告组件 -->
    <div class="home-banner">
        <XtxCarousel :slider="bannners" :autoPlay="true"></XtxCarousel>
    </div>
</template>
<script>
// 导入vuex
// import { useStore } from 'vuex'
import { reactive } from 'vue'
// import { ref } from 'vue'
// 导入接口
import { getBanners } from '@/api/home'

export default {
  name: 'HomeBanner',
  setup () {
    const bannners = reactive([])
    // const bannners = ref([])

    // 1.直接调用接口,获取轮播图数据
    getBanners().then((data) => {
      bannners.push(...data.result)
      // 如果是reactive([])声明数组,这里的等号赋值会让arr失去响应式
      // bannners.value = data.result
      // return bannners
    })

    return { bannners }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
