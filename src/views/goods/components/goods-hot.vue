<template>
<!-- 商品详情-热榜组件 -->
 <div class="goods-hot">
     <h3>{{titleHot}}</h3>
     <template v-if="goodsList">
         <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item"></GoodsItem>
     </template>

 </div>
</template>
<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
// 引入接口
import { findHotGoods } from '@/api/goods'
// 引入组件
import GoodsItem from '@/views/category/components/goods-item'
export default {
  name: 'GoodsHot',
  props: {
    // 传入组件的类型:1代表24小时热销榜 2代表周热销榜 3代表总热销榜
    typeHot: {
      type: Number,
      default: 1
    }
  },
  components: { GoodsItem },
  setup (props) {
    // 1.根据类型，显示标题
    const titleObj = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const titleHot = computed(() => {
      return titleObj[props.typeHot]
    })

    // 2.商品列表
    const route = useRoute()
    const goodsList = ref([])
    findHotGoods({ id: route.params.id, type: props.typeHot }).then(data => {
      // console.log(data)
      goodsList.value = data.result
    })
    return { titleHot, goodsList }
  }
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
