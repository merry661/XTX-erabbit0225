<template>
<!-- 商品详情-基础布局 -->
<!-- 防止报错，加载完成goods再显示所有内容 -->
 <div class='xtx-goods-page' v-if="goodsProduct">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/'+ goodsProduct.categories[0].id">{{goodsProduct.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/'+ goodsProduct.categories[1].id">{{goodsProduct.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem to="/">{{goodsProduct.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
          <div class="media">
              <!-- 左侧，图片预览 -->
              <GoodsImage :images="goodsProduct.mainPictures">
                  <GoodsSales></GoodsSales>
              </GoodsImage>
          </div>
          <div class="spec">
            <!-- 商品名字组件 -->
              <GoodsName :goods="goodsProduct"></GoodsName>
              <!-- 规格组件 -->
              <GoodsSku :goods="goodsProduct" @change="changeSku"/>
              <!-- 数量选择组件 -->
              <XtxNumbox label="数量" v-model="productCount" :max="goodsProduct.inventory"></XtxNumbox>
            <!-- 公共按钮 -->
              <XtxButton type="primary" style="margin-top:20px;" @click="insertCart()">加入购物车</XtxButton>
          </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goodsProduct.id"/>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
            <!-- 商品+评价 -->
            <GoodsTabs></GoodsTabs>
             <!-- 注意事项 -->
             <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
            <GoodsHot :typeHot="1"></GoodsHot>
            <GoodsHot :typeHot="2"></GoodsHot>
        </div>
     </div>
    </div>
</div>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { nextTick, ref, watch, provide } from 'vue'
import Message from '@/components/library/Message'
// 引入子组件
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
// 引入接口
import { findGoods } from '@/api/product'

export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    const goodsProduct = useGoods()
    const currSku = ref(null)// 当前库存信息
    const productCount = ref(1)

    const changeSku = (sku) => { // 1. 修改商品规格--影响商品库存
      if (sku.skuId) { // 修改商品的现价原价库存信息
        goodsProduct.value.price = sku.price
        goodsProduct.value.oldPrice = sku.oldPrice
        goodsProduct.value.inventory = sku.inventory
        currSku.value = sku // 记录选择后的sku，可能有数据，可能没有数据{}
      } else {
        currSku.value = null
      }
    }

    // 2.提供goods数据给后代组件使用
    provide('goods', goodsProduct)

    // 3.加入购物车逻辑
    const store = useStore()
    const num = ref(1)// 选择数量

    const insertCart = () => {
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goodsProduct.value
        store.dispatch('cart/insertCartAc', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功' })
        }).catch(e => {
          Message({ text: '请选择完整规格' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }

    return { goodsProduct, changeSku, productCount, insertCart }
  }
}
// 单独封装，从接口获取商品信息
const useGoods = () => {
  // 1.出现路由地址商品ID发生变化，但不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()

  watch(() => route.params.id, (newGoodId) => {
    if (newGoodId && route.path === `/product/${route.params.id}`) {
      findGoods(route.params.id).then(({ result }) => {
        // 2. 让商品数据为null, 使用v-if的组件可以重新销毁和创建???
        goods.value = null
        // console.log(result, '商品')

        nextTick(() => { // ？？？
          goods.value = result
        })
      })
    }
  }, {
    immediate: true
  })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

</style>
