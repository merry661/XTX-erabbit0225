<template>
<!-- 结果区-排序组件 -->
 <div class='sub-sort'>
    <div class="sort">
      <a href="javascript:;"
        :class="{active:sortParams.sortField === null }"
        @click="changeSort(null)"
      >默认排序</a>
      <a href="javascript:;"
        :class="{active:sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
      >最新商品</a>
      <a href="javascript:;"
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
      >最高人气</a>
      <a href="javascript:;"
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
      >评论最多</a>
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i class="arrow up"
            :class="{active:sortParams.sortField==='price'
            && sortParams.sortMethod === 'asc'}"
        />
        <i class="arrow down"
            :class="{active:sortParams.sortField === 'price' &&
            sortParams.sortMethod === 'desc'}"
        />
      </a>
    </div>
    <div class="check-box">
      <XtxCheckbox
        @change="changeCheck"
        v-model="sortParams.inventory"
      >仅显示有货商品</XtxCheckbox>
      <XtxCheckbox
        @change="changeCheck"
        v-model="sortParams.onlyDiscount"
      >仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 1. 根据后台需要的参数定义数据对象
    // 2. 根据数据对象，绑定组件（复选框，排序按钮）
    // 3. 在操作排序组件的时候，需要反馈给数据对象

    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null, // publishTime,orderNum,price,evaluateNum
      sortMethod: null // asc为正序，desc为倒序，默认为desc
    })

    // 1.点击排序按钮，更改排序方式
    const changeSort = (sortField) => {
      if (sortField === 'price') { // 价格
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) { // 排序
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果排序未改变,则停止逻辑
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      emit('sorChange', sortParams)// 改变排序,把排序参数告诉父组件
    }

    // 2.点击右侧 checkbox，更改 商品list显示
    const changeCheck = () => {
      emit('sorChange', sortParams)// 改变排序,把排序参数告诉父组件
    }
    return { sortParams, changeSort, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check-box {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
