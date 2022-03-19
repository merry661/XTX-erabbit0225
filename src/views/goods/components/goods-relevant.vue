<template>
<!-- -商品详情-同类推荐组件 -->
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />

      <!-- 通过是否传入商品ID来区别同类推荐和猜你喜欢 -->
      <span class="title">{{ goodsId ? '同类商品推荐' : '猜你喜欢'}}</span>
    </div>
    <!-- 此处使用改造后的xtx-carousel.vue -->
     <XtxCarousel :slider="sliders" style="height:380px" auto-play />
  </div>
</template>

<script>
import { findRelGoods } from '@/api/goods'
import { ref } from 'vue'
// 1.获取接口数据
const useRelGoodsData = (goodsId) => {
  const sliders = ref([])// 轮播图

  findRelGoods(goodsId).then(data => {
  // 每页4条
    const size = 4
    const totalPage = Math.ceil(data.result.length / size)
    for (let i = 0; i < totalPage; i++) {
      sliders.value.push(data.result.slice(i * size, (i + 1) * size))// 截取，获得当前页的数据
    }
  })

  return sliders
}
export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const sliders = useRelGoodsData(props.goodsId)
    console.log(sliders)
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
:deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
