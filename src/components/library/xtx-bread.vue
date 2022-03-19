
<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  // 用法
  // 1. template 标签去除，单文件组件
  // 2. 返回值就是组件内容
  // 3. vue2.0 的h函数传参进来的，vue3.0 的h函数导入进来
  // 4. h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
  // 需求
  // 1. 创建xtx-bread父容器
  // 2. 获取默认插槽内容
  // 3. 去除xtx-bread-item组件的i标签，因该由render函数来组织
  // 4. 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
  // 5. 把动态创建的节点渲染再xtx-bread标签中
  render () {
    const items = this.$slots.default()// 获取默认插槽内容
    const dynamicItems = []// 用来 收集动态创建的节点

    items.forEach((item, i) => { // 遍历插槽中的item，得到一个动态创建的节点，最后一个item不加i标签
      // 对插槽节点进行判断（是XtxBreadItem和Transition才进行组装）
      if (item.type.name === 'XtxBreadItem' || item.type.displayName === 'Transition') {
        dynamicItems.push(item)
        if (i < (items.length - 1)) { // 最后一个item不加i标签
          dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
        }
      }
    })

    // h 第一个参数 标签名字  第二个参数 标签属性对象  第三个参数 子节点
    // h函数的作用，创建dom元素，在这里是：创建xtx-bread父容器
    // 把动态创建的节点渲染再xtx-bread标签中
    return h('div', { class: 'xtx-bread' }, dynamicItems)
  }

  // props: {
  //   parentName: { // 父级 路由名字
  //     type: String,
  //     default: ''
  //   },
  //   parentPath: { // 父级 路由地址
  //     type: String,
  //     default: ''
  //   }
  // }
}
</script>

<style lang='less'>
// 去除 scoped 属性，目的：让父级样式作用到xtx-bread-item组件
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}

</style>
