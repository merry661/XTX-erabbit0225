
<script>
import { getCurrentInstance } from 'vue'
export default {
  name: 'XtxSteps',
  props: { // xtx-steps 设置激活步骤
    active: {
      type: Number,
      default: 1
    }
  },
  render (props) {
    const data = getCurrentInstance()

    const items = data.ctx.$slots.default()// 1. 获取到默认插槽的节点
    // console.log(items, '000000000000')//items是XtxSteps的所有子节点

    const dynamicItems = []
    items.forEach(item => {
      if (item.type.name === 'XtxStepsItem') { // 2. 获取所有的动态生成的XtxStepsItem组件节点
        dynamicItems.push(item)
      } else {
        item.children.forEach(c => {
          dynamicItems.push(c)
        })
      }
    })
    const itemsJsx = dynamicItems.map((item, i) => { // 3. 根据动态节点生成 item 的jsx对象
      // return <div class="xtx-steps-item">
      return <div class="xtx-steps-item" class={{ active: i < props.active }}>
        <div class="step"><span>{i + 1}</span></div>
        <div class="title">{item.props.title}</div>
        <div class="desc">{item.props.desc}</div>
      </div>
    })

    return <div class="xtx-steps">{itemsJsx}</div> // 4. 将item放入外层容器中
  }
}
</script>
<style lang="less">
.xtx-steps {
  display: flex;
  text-align: center;
  &-item {
    flex: 1;
    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }
    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }
    &.active {
      .step {
        > span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }
        &::before,&::after {
          background: @xtxColor;
        }
      }
      .title {
        color: @xtxColor;
      }
    }
    .step {
      position: relative;
      > span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }
      &::after,&::before{
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }
      &::before {
         left: 0;
      }
      &::after {
         right: 0;
       }
    }
    .title {
      color: #999;
      padding-top: 12px;
    }
    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }
  }
}
</style>
