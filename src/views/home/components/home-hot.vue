<template>
<!-- 首页-面板部分-人气面板 -->
    <div class='home-hot'>
      <!-- 左侧题目，中间内容，右侧图标 -->
      <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">

          <div ref="myHot" style="position:relative;height:426px">
             <Transition name="fade">
             <!-- 面板内容 显隐逻辑 -->
             <ul class="goods-list" v-if="goods.length">
                 <li v-for="item in goods" :key="item.id">
                     <router-link :to="`/product/${item.id}`">
                         <!-- <img :src="item.picture" alt=""> -->
                          <img alt="" v-lazy="item.picture" />
                         <p class="name ellipsis">{{item.title}}</p>
                         <p class="desc">{{item.alt}}</p>
                     </router-link>
                 </li>
             </ul>

             <!-- 面板骨架 部分 -->
             <HomeSkeleton v-else></HomeSkeleton>
             </Transition>
          </div>
       </HomePanel>

    </div>
</template>
<script>
// import { ref } from 'vue'
import HomePanel from './home-panel'
import { findHot } from '@/api/home'

// 引入骨架组件
import HomeSkeleton from './home-skeleton.vue'
// 引入组件懒加载函数
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeHot',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // 2.组件懒加载
    const { target, result } = useLazyData(findHot)
    // // 1.调用接口，获取数据
    // const goods = ref([])
    // findHot().then((data) => {
    //   goods.value = data.result
    //   console.log(goods.value)
    // })
    return { myHot: target, goods: result }
  }

}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
.fade{
  &-leave {
    &-active {
      position: absolute;
      width: 100%;
      transition: opacity .5s .2s;
      z-index: 1;
    }
    &-to {
      opacity: 0;
    }
  }
}
</style>
