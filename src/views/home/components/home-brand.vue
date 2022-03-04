<template>
<!-- 首页-面板部分-热门品牌 -->
    <div class='home-brand'>
        <!-- <div style="position:relative;height:426px"> -->

        <!-- 左侧题目，中间内容，右侧图标 -->
         <HomePanel title="热门品牌" subTitle="国际经典 品质保证">
              <!-- 插槽 -->
             <template v-slot:right>
                 <a @click="toggle(-1)" href="javascript:;" :class="{disabled:indexBr===0}" class="iconfont icon-angle-left prev"></a>
                 <a @click="toggle(1)"  href="javascript:;" :class="{disabled:indexBr===1}" class="iconfont icon-angle-right next"></a>
             </template>

               <div ref="myBrand" class="box">
                 <Transition name="fade">
                    <ul  class="list" v-if="brands.length" :style="{transform:`translateX(${-indexBr*1240}px)`}">
                        <li v-for="(item,index) in brands" :key="index">
                            <router-link to="/">
                                <!-- <img :src="item.picture" alt=""> -->
                                <img alt="" v-lazy="item.picture" />
                            </router-link>
                        </li>
                     </ul>

                     <!-- 面板骨架 部分 -->
                     <!-- <HomeSkeleton v-else></HomeSkeleton> -->
                     <div v-else class="skeleton">
                         <XtxSkeleton class="item" v-for="i in 5"
                         :key="i" animated bg="#e4e4e4"
                         width="240px"
                         height="305px"/>
                      </div>
                   </Transition>
               </div>

         </HomePanel>
        </div>
    <!-- </div> -->
</template>
<script>
import HomePanel from './home-panel'
import { getHotBrand } from '@/api/home'
import { ref } from 'vue'
// 引入骨架组件
// import HomeSkeleton from './home-skeleton.vue'
// 引入组件懒加载函数
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeBrand',
  components: {
    HomePanel
    // ,HomeSkeleton
  },
  setup () {
    // 1.组件懒加载
    // 注意：useLazyData参数是API函数，如果遇到要传参的情况，自己写个函数，在函数中调用API
    const { target, result } = useLazyData(() => getHotBrand(10))

    // 2.点击右上交的箭头，轮播图滑动
    const indexBr = ref(0)
    const toggle = (step) => {
      const newIndex = indexBr.value + step
      if (newIndex > 1 || newIndex < 0) {
        return
      }
      indexBr.value = newIndex
    }
    return { myBrand: target, brands: result, toggle, indexBr }
  }

}
</script>

<style scoped lang='less'>
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
