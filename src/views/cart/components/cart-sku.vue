<template>
  <div class="cart-sku" ref="targetSKU">
    <div class="attrs"  @click="toggle()">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <!-- 弹层 -->
    <div class="layer" v-if="visible">
        <!-- 弹层--加载中效果 -->
      <div v-if="!goods" class="loading"></div>

      <!-- 商品规格信息 -->
      <GoodsSku v-if="goods" :skuId="skuId" :goods="goods" @change="changeSku"/>
      <!-- 确认按钮 -->
       <XtxButton v-if="goods" type="primary" size="mini"
       style="margin-left:60px" @click="submit()">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import GoodsSku from '@/views/goods/components/goods-sku'
import { getGoodsSku } from '@/api/cart'
export default {
  components: { GoodsSku },
  name: 'CartSku',
  props: {
    attrsText: { // 规格描述信息
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const goods = ref(null)

    const show = () => { // 显示弹框
      visible.value = true

      getGoodsSku(props.skuId).then(data => { // 获取当前商品的spec和sku数据
        goods.value = data.result
        console.log(goods.value)
      })
    }
    const hide = () => { // 隐藏弹框
      visible.value = false
      goods.value = null
    }
    // 切换弹框
    const toggle = () => {
      visible.value ? hide() : show()
    }

    const targetSKU = ref(null)
    // 点击弹框外部，关闭弹框
    onClickOutside(targetSKU, () => {
      hide()
    })

    // 选择SKU时候触发
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku // 监听sku改变的函数，记录sku信息
    }
    // 点击确认的时候，更改后的sku信息提交给父组件（购物车组件）
    const submit = () => {
      // 当你currSku有值，且skuId和默认的skuId不同
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
      }
      hide()
    }
    return { visible, toggle, targetSKU, goods, changeSku, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
