<template>
<!-- 轮播图基础组件 -->
  <div class='xtx-carousel'>
    <ul class="carousel-body">
      <li class="carousel-item"
        v-for="(item,i) in slider"
        :key="item.id"
        :class="{fade:i===index}"
        @mouseenter="stop()"
        @mouseleave="start()">

        <RouterLink v-if="item.hrefUrl" :to="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <div v-else class="slider">
          <router-link v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
              <img :src="goods.picture" alt="">
              <p class="name ellipsis">{{goods.name}}</p>
              <p class="price">&yen;{{goods.price}}</p>
          </router-link>
        </div>
      </li>
    </ul>

    <!-- 左右箭头 -->
    <a href="javascript:;"
      @click="toggle(-1)"
      class="carousel-btn prev">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <a href="javascript:;"  @click="toggle(1)" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>

    <!-- 底部圆点 -->
    <div class="carousel-indicator">
      <span
        v-for="(item,indexY) in slider"
        :key="indexY"
        :class="{active:indexY === index}"
        @click="clickDot(indexY)"
       >
      </span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
// import { ref, watch, toRaw } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    // 1.循环数据
    slider: {
      type: Array,
      default: () => []// 为什么数组要这样呢?
    },
    // 2.轮播图间隔时间
    duration: {
      type: Number,
      default: 3000
    },
    // 3.轮播图是否自动播放
    autoPlay: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    // fade是控制显示那张图片的，需要一个默认索引数据，渲染第一张图和激活第一个点
    const index = ref(0)// 1.默认显示的图片的索引

    // 2.自动轮播实现--定时器实现
    let timer = null
    const autoPlayFun = () => {
      // 清空定时器
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++

        if (index.value > props.slider.length - 1) {
          index.value = 0
        }
      }, props.duration)
    }

    // 3.监听轮播图数据 有数据&开启自动播放，才调用自动播放函数
    watch(() => props.slider,
      (newValue) => {
        if (newValue && props.autoPlay) {
          // index.value = 0
          autoPlayFun()
        }
      },
      { immediate: true })

    // 4.如果有自动播放,鼠标进入停止，移出开启自动
    const stop = () => {
      // console.log('进来了')
      if (timer) { clearInterval(timer) }
    }
    const start = () => {
      // console.log('出来了')
      if (props.slider.length && props.autoPlay) {
        autoPlayFun()
      }
    }

    // 5.指示器切(左右箭头)，上一张，下一张
    // 参数：每次移动的距离？
    const toggle = (step) => {
      const newIndex = index.value + step

      // 不能一直减，也不能一直加
      if (newIndex < 0) {
        index.value = props.slider.length - 1
        return
      } else if (newIndex > props.slider.length - 1) {
        index.value = 0
        return
      }
      // 正常
      index.value = newIndex
    }
    // 点击底部的小点
    const clickDot = (newIndex) => {
      index.value = newIndex
    }

    // 6.销毁组件，清理定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, autoPlayFun, stop, start, toggle, clickDot }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}

// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
