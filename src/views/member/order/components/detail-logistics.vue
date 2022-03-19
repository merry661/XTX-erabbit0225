<template>
  <div class="detail-logistics">
    <p>
       <span>{{list[0].text}}</span>
       <span>{{list[0].time}}</span>
    </p>
     <a href="javascript:;" @click="handlerLogistics(order)">查看物流</a>
     <!-- 查看物流组件 -->
    <teleport to="#dialog">
        <OrderLogistics ref="logisticsOrderCom"></OrderLogistics>
    </teleport>
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import { useLogisticsOrder } from '../index'
import OrderLogistics from './order-logistics'
import { ref } from 'vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  async setup (props) { // 组件实例化的时候需要执行setup，因为需要返回渲染模版需要的数据。
    const data = await logisticsOrder(props.order.id)
    const list = ref(data.result.list)

    return { list, ...useLogisticsOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
