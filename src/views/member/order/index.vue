<template>
  <div class="member-order">

    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </XtxTabsPanel>
    </XtxTabs>

    <!-- 订单列表 -->
    <div class="order-list">
        <div v-if="loading" class="loading"></div>
        <div class="one" v-if="!loading && orderList.length === 0">暂无数据</div>
        <OrderItem
            v-for="item in orderList"
            :key="item.id"
            :order="item"
            @on-cancel="handlerCancel"
            @on-delete="handlerDelete"
            @on-confirm="handlerConfirm"
            @on-logistics="handlerLogistics"
        />
    </div>

    <!-- 分页组件 -->
     <XtxPagination
      v-if="(total > requestParams.pageSize) && orderList.length>0"
      :currentPage="requestParams.page"
      :pageSize="requestParams.pageSize"
      :total="total"
      @current-change="requestParams.page=$event"
    />

    <!-- 取消原因组件 -->
     <Teleport to="#model">
          <OrderCancel ref="orderCancelCom" />
     </Teleport>

        <!-- 查看物理组件 -->
    <Teleport to="#dialog">
      <OrderLogistics ref="logisticsOrderCom" />
    </Teleport>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { delteOrder, findOrderList, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item'
// 引入取消订单组件
import OrderCancel from './components/order-cancel'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics'
export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')// 被激活的tab 名字
    const loading = ref(false)// 加载中效果

    // 参数：子组件传来的(name, index)
    const tabClick = (tab) => {
      // 此时：tab.index 就是订单的状态
      requestParams.orderState = tab.index
      requestParams.page = 1
    }

    // 2.查询订单参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })

    // 4.调用接口，查询订单
    const orderList = ref([]) // 3.订单列表
    const total = ref(0)

    const getOrderList = () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        orderList.value = data.result.items// 订单列表
        total.value = data.result.counts
        loading.value = false
      })
    }
    // 5.筛选条件变化重新加载
    watch(requestParams, () => {
      getOrderList()// 只要筛选条件变化，就会调用接口 重新渲染列表
    }, {
      immediate: true
    })

    // 6.删除订单
    const handlerDelete = (item) => {
      Confirm({ text: '您确认删除该条订单吗？' }).then(() => {
        delteOrder([item.id]).then(() => {
          Message({ text: '删除订单成功', type: 'success' })
          getOrderList()
        })
      }).catch(e => {})
    }
    return {
      activeName,
      tabClick,
      orderStatus,
      orderList,
      loading,
      total,
      requestParams,
      handlerDelete,
      ...useCancel(),
      ...useConfirmOrder(),
      ...useLogisticsOrder()
    }
  }
}
// 7.取消订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  //   点击取消,参数是你要取消的订单
  const handlerCancel = (order) => {
    console.log(orderCancelCom.value, '000')
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// 8.封装逻辑-确认收货
export const useConfirmOrder = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '亲，您确认收货吗？确认后货款将打给卖家。' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '确认收货成功' })
        order.orderState = 4// 变更订单状态:待收货--->待评价
      })
    }).catch(e => {})
  }
  return { handlerConfirm }
}

// 9.封装逻辑-查看物流
// 封装逻辑-查看物流
export const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const handlerLogistics = (item) => {
    logisticsOrderCom.value.open(item)
  }
  return { handlerLogistics, logisticsOrderCom }
}
</script>
<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
