
<script>
// 订单管理-tabs组件容器：可以有多个 xtx-tabs-panel 组件面板
// xtx-tabs 组件组织结构，控制点击事件，标签页激活。

import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)// 1.接受v-model的值

    const tabClick = (name, index) => { // 3.点击选项卡触发函数
    //   console.log(name, index, '999999999999999')

      activeName.value = name
      emit('tab-click', { name, index }) // 4.向父组件提供tab-click自定义事件
    }

    provide('activeName', activeName)// 2.给每一个panel传当前激活的name

    return { activeName, tabClick }
  },
  render () {
    // jsx语法，它能够让我们创建节点和写html一样
    // 1. 动态插值表达式{} 2. 尽量三元表示式做判断，使用map来遍历 3.事件使用原始方式绑定

    const panels = this.$slots.default()//  1.获取插槽内容
    // console.log(panels, '999')

    const dynamicPanels = [] //  2.动态的 面板组件集合

    panels.forEach(item => {
      if (typeof item.type !== 'symbol' && item.type.name === 'XtxTabsPanel') { // 静态
        dynamicPanels.push(item)
      } else {
        if (item.children && item.children.length >= 0) {
          item.children.forEach(item => (dynamicPanels.push(item)))
        }
      }
    })

    //  3.组织：tabs组件大容器，选项卡的导航菜单结构，内容容器
    const nav = ( // 选项卡
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a
              onClick={() => this.tabClick(item.props.name, i)}
              class={{ active: item.props.name === this.activeName }}
              href="javascript:;"
            >
              {item.props.label}
            </a>
          )
        })}
      </nav>
    )

    return <div class="xtx-tabs">{[nav, panels]}</div>
  }
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
