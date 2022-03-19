<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                  <XtxCheckbox @change="checkAll " :modelValue="$store.getters['cart/isCheckAll']">
                  全选
                  </XtxCheckbox></th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
              <tr v-if="$store.getters['cart/validList'].length === 0">
                <td colspan="6">
                    <CartNone />
                </td>
              </tr>
            <tr v-for="itemY in $store.getters['cart/validList']" :key="itemY.skuId">
              <td><XtxCheckbox @change="($event)=>changeItem(itemY.skuId,$event)"
                  :modelValue="itemY.selected"/>
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${itemY.id}`">
                      <img :src="itemY.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{itemY.name}}</p>
                    <!-- 选择规格组件 -->
                    <!-- <p class="attr">{{itemY.attrsText}}</p> -->
                    <CartSku
                        @change="($event) => updateCartSku(itemY.skuId, $event)"
                        :skuId="itemY.skuId"
                        :attrsText="itemY.attrsText"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{itemY.nowPrice}}</p>
                <p v-if="itemY.price - itemY.nowPrice>0">
                    比加入时降价
                    <span class="red">&yen;{{itemY.price-itemY.nowPrice}}</span>
                </p>
              </td>
              <td class="tc">
                <!-- 商品数量 -->
                <XtxNumbox
                    :max="itemY.stock"
                    @change="$event=>changeCount(itemY.skuId,$event)"
                    :modelValue="itemY.count"
                />
              </td>
              <td class="tc">
                  <!-- 小计钱数 -->
                  <p class="f16 red">&yen;{{itemY.nowPrice * 100 *itemY.count/100}}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;"  @click="deleteCart(itemY.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
           <tbody v-if="$store.getters['cart/invalidList'].length>0">
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="item in $store.getters['cart/validList']" :key="item.skuId">
              <td><XtxCheckbox style="color:#eee;" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <p class="attr">{{item.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;{{item.nowPrice}}</p></td>
              <td class="tc">{{item.count}}</td>
              <td class="tc"><p>&yen;{{item.nowPrice*100*item.count/100}}</p></td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change="checkAll " :modelValue="$store.getters['cart/isCheckAll']">
          全选
          </XtxCheckbox>
          <!-- 批量删除 -->
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共{{$store.getters['cart/validTotal']}} 件商品，已选择 {{$store.getters['cart/selectedTotal']}}件，商品合计：
          <span class="red">¥{{$store.getters['cart/selectedAmount']}}</span>
          <XtxButton type="primary" @click="goCheckout()">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from './components/cart-none'
import CartSku from './components/cart-sku'
import { useStore } from 'vuex'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    // 1.点击单选按钮，触发change事件
    const changeItem = (skuId, selected) => {
      console.log(skuId, selected)
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 2.全选框
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 3.删除
    const deleteCart = (skuId) => {
    // store.dispatch('cart/deleteCart', skuId)
    // 提示框
      Confirm({ text: '您确定从购物车删除该商品吗？' }).then(() => {
        store.dispatch('cart/deleteCart', skuId).then(() => {
          Message({ type: 'success', text: '删除成功' })
        })
      }).catch(e => {
        console.log('点击取消')
      })
    }
    // 4.批量删除
    const batchDeleteCart = (isClear) => {
      Confirm({ text: `您确定从购物车删除${isClear ? '失效' : '选中'}的商品吗？` }).then(() => {
        // 调用store中的action方法
        store.dispatch('cart/batchDeleteCart', isClear).then(() => {
          Message({ type: 'success', text: '删除成功' })
        })
      }).catch(e => {
        Message({ text: `${isClear ? '失效' : '选中'}失败` })
      })
    }

    // 5.修改数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }

    // 6.修改购物车中 商品的规格
    // 参数：传入默认值和当前的商品信息
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }

    // 7.跳转到结算页面
    const router = useRouter()
    const goCheckout = () => {
      // 1. 判断是否选择有效商品
      // 2. 判断是否已经登录，未登录 弹窗提示
      // 3. 进行跳转 （需要做访问权限控制）
      if (store.getters['/cart/selectedTotal'] === 0) {
        return Message({ text: '至少选中一件商品才能结算' })
      }
      if (!store.state.user.profile.token) { // 未登录
        Confirm({ text: '下单结算需要登录，您是否去登录？' }).then(() => {
          router.push('/member/checkout') // 点击确认
        }).catch(e => {})
      } else {
        router.push('/member/checkout')
      }
    }
    return { changeItem, checkAll, deleteCart, batchDeleteCart, changeCount, updateCartSku, goCheckout }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,td{
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
