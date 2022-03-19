<template>
<!-- 订单详情-头部展示 -->
  <div class="member-order-detail" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailSteps :order="order" ></DetailSteps>
    <!-- 物流栏 -->
    <Suspense>
      <template #default>
        <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order"/>
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order" />
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import DetailAction from './components/detail-action'
import DetailSteps from './components/detail-steps'
import DetailLogistics from './components/detail-logistics'
import DetailInfo from './components/detail-info'
export default {
  name: 'OrderDetailPage',
  components: {
    DetailAction,
    DetailSteps,
    DetailLogistics,
    DetailInfo
  },
  setup () {
    // 获取订单数据
    const order = ref(null)
    const route = useRoute()
    console.log(route)
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style scoped lang="less">
.member-order-detail {
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
