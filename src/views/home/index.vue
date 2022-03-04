<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />

          <!-- 轮播图 -->
          <HomeBanner></HomeBanner>
      </div>

      <!-- 面板部分 -->
      <!-- 新鲜好物 -->
     <HomeNew></HomeNew>
     <!-- 人气推荐 -->
     <HomeHot></HomeHot>
     <!-- 热门品牌 -->
     <HomeBrand></HomeBrand>
      <!-- 商品展示区--居家 -->
     <HomeProduct></HomeProduct>
     <!-- 最新专题 -->
     <HomeSpecial></HomeSpecial>
    </div>
  </div>
</template>
<script>
import HomeCategory from '@/components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>
<style scoped lang="less"></style>
