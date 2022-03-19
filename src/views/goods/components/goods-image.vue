<template>
<!-- 商品图片组件 -->
<div class="goods-image">
    <!-- 大图 -->
    <div class="large"
        v-show="showLayer"
        :style="[{ backgroundImage: `url(${images[currIndex]})` }, bgPosition]"
    >
    </div>
    <!-- 中图 -->
    <div class="middle" ref="containerM">
        <img :src="images[currIndex]" alt="">
        <!-- 遮罩层 -->
        <div class="layer" v-show="showLayer" :style="position"></div>
    </div>

    <!-- 小图 -->
    <ul class="small">
        <li
        v-for="(img,index) in images"
        :key="index"
        :class="{active:index===currIndex}">
            <img :src="img" alt=""  @mouseenter="currIndex=index">
        </li>
    </ul>
</div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    // 父组件传来图片
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)

    // 在setup中返回模板需要数据，并使用它
    const { position, bgPosition, showLayer, containerM } = usePreviewImg()
    return { currIndex, position, bgPosition, showLayer, containerM }
  }
}

// 使用vueuse提供的API获取鼠标 在“中图”上的偏移量
const usePreviewImg = () => {
  const containerM = ref(null)
  const showLayer = ref(false)// 是否显示遮罩和大图

  // elementX 鼠标基于容器左上角X轴偏移
  // elementY 鼠标基于容器左上角Y轴偏移
  // isOutside 鼠标是否在模板容器外
  // 使用useMouseInElement得到基于元素左上角的坐标和是否离开元素数据
  const { elementX, elementY, isOutside } = useMouseInElement(containerM)

  const position = reactive({ left: 0, top: 0 })// 遮罩的坐标(样式)/计算坐标
  const bgPosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })// 大图背景定位(样式)

  watch([elementX, elementY, isOutside], () => {
    // 1.控制X轴方向的定位 0-200 之间,控制在containerM容器内
    if (elementX.value < 100) position.left = 0
    else if (elementX.value > 300) position.left = 200
    else position.left = elementX.value - 100

    // 5.控制Y轴方向的定位 0-200 之间
    if (elementY.value < 100) position.top = 0
    else if (elementY.value > 300) position.top = 200
    else position.top = elementY.value - 100

    // 2.设置大背景的定位(因为大图面积是中图的2倍)
    bgPosition.backgroundPositionX = -position.left * 2 + 'px'
    bgPosition.backgroundPositionY = -position.top * 2 + 'px'

    // 3.设置遮罩容器的定位
    position.left = position.left + 'px'
    position.top = position.top + 'px'

    // 4.设置是否显示预览大图
    showLayer.value = !isOutside.value
  })
  // 返回值
  return { position, bgPosition, showLayer, containerM }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
