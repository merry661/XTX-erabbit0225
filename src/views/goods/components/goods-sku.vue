<template>
<!-- 商品规格组件,sku:标识库存量 -->
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <!-- 规格名字 -->
      <dt>{{item.name}}</dt>
      <!-- 规格选项 -->
      <dd>
          <template v-for="value in item.values" :key="value.name">
            <img
                :class="{ selected: value.selected, disabled: value.disabled }"
                :src="value.picture"
                :title="value.name"
                v-if="value.picture"
                @click="clickSpecs(item,value)"
            >
            <span
                v-else
                @click="clickSpecs(item,value)"
                :class="{ selected: value.selected, disabled: value.disabled }"
            >{{value.name}}</span>
          </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '★'
// 1.根据skus数据得到路径字典对象
// 1). 得到所有的sku集合  props.goods.skus
// 2). 从所有的sku中过滤出 有库存 有效的sku
// 3). 根据有效的sku使用power-set算法得到子集
// 4). 根据子集往路径字典对象中存储 key-value
const getPathMap = (skus) => {
  // console.log(skus, '库存')
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory) {
      const specs = sku.specs.map(spec => spec.valueName)// 得到sku属性值数组
      const powerSet = getPowerSet(specs)// 得到子集
      powerSet.forEach((set) => {
        const key = set.join(spliter)

        if (pathMap[key]) {
          pathMap[key].push(sku.id)// 已经有key往数组追加
        } else {
          pathMap[key] = [sku.id] // 没有key设置一个数组
        }
      })
    }
  })
  return pathMap
}
// 2. 得到当前选中规格的数组
const getSelectedArr = (specs) => {
//   console.log(specs, '??')
  const selectedArr = []

  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 3.更新按钮禁用状态
const updateBtnDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedBtnArr = getSelectedArr(specs)
    spec.values.forEach(val => {
    //   console.log(val, '这是啥啊')
      if (val.name === selectedBtnArr[i]) {
        return false// 已经选中的按钮不用判断
      }
      selectedBtnArr[i] = val.name// 未选中的替换对应的值
      const key = selectedBtnArr.filter(item => item).join(spliter) // 过滤无效值得到key
      val.disabled = !pathMap[key] // 设置禁用状态
    })
  })
}
// 4.默认选中,初始化按钮的选中状态
// 参数：父组件传来的值
const initSelectedStatus = (goods, skuId) => {
  // 1. 找出sku的信息
  // 2. 遍历每一个按钮，按钮的值和sku记录的值相同，就选中。
  const sku = goods.skus.find(sku => sku.id === skuId)
  console.log(sku, '000')
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    },
    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)// 根据skus数据得到路径字典对象
    if (props.skuId) {
      initSelectedStatus(props.goods, props.skuId)// 根据传入的skuId默认选中规格按钮
    }

    updateBtnDisabledStatus(props.goods.specs, pathMap) // 2. 组件初始化的时候更新禁用状态

    // 1.染与选中效果
    const clickSpecs = (item, val) => {
      if (val.disabled) return false// 如果是禁用状态不作为
      if (val.selected) { // 已选中，点击后，改为未选中
        val.selected = false
      } else { // 未选中，点击后，遍历所有的value先置为未选中，再将当前按钮置为选中
        item.values.forEach((o) => { o.selected = false })
        val.selected = true
      }
      // 点击的时候更新禁用状态
      updateBtnDisabledStatus(props.goods.specs, pathMap)

      // 触发change事件将sku数据传给父组件
      const validSelectedValues = getSelectedArr(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 完整
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 ... 这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // 不完整
        // 父组件需要判断是否规格选择完整，不完整不能加购物车。
        emit('change', {})
      }
    }

    return { clickSpecs }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin: 5px 0;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
