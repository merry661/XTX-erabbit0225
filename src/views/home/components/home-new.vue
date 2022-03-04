<template>
<!-- 首页-面板部分-新鲜好物 -->
    <div class='home-new'>
       <!-- 左侧题目，中间内容，右侧图标 -->
       <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
          <!-- 插槽 -->
          <template v-slot:right>
            <!-- 右侧查看全部 -->
            <XtxMore path="/"></XtxMore>
          </template>

        <!-- vue 动画效果组件 -->
        <!-- 动画的父容器需要是定位，防止定位跑偏 -->
          <div ref="box" style="position:relative;height:426px">
           <Transition name="fade">
             <!-- 面板内容 -->
             <ul class="goods-list" v-if="goods.length">
               <li v-for="item in goods" :key="item.id">
                   <router-link :to="`/product/${item.id}`">
                       <!-- <img :src="item.picture" alt=""> -->
                        <img alt="" v-lazy="item.picture" />
                       <p class="name ellipsis">{{item.name}}</p>
                       <p class="price">￥{{item.price}}</p>
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
import { getNews } from '@/api/home'

// 引入骨架组件
import HomeSkeleton from './home-skeleton.vue'

// 引入组件懒加载函数
// import { useIntersectionObserver } from '@vueuse/core'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])
    // 怎么与dom中的ref联系起来的呢？，声明同名的响应式对象，return后会与同名dom自动绑定
    // const box = ref(null)
    // 2.组件懒加载
    const { target, result } = useLazyData(getNews)

    // 参数：被监听的dom对象；回调函数；配置对象
    // const { stop } = useIntersectionObserver(
    //   box,
    //   ([{ isIntersecting }]) => {
    //     console.log(stop, '000')
    //     if (isIntersecting) {
    //       stop()
    //       getNews().then((data) => { // 调用接口
    //         goods.value = data.result
    //       })
    //     }
    //   })

    // 1.调用接口，获取数据
    // getNews().then((data) => {
    //   goods.value = data.result
    //   console.log(goods.value)
    // })
    // return { goods, box }
    return { box: target, goods: result }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  >li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    >img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
