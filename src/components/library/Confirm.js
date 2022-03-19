// 实现函数式调用组件方式和完成交互
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm' // 导入被创建的组件

// 准备一个dom容器装载组件
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 该函数渲染XtxConfirm组件，标题和文本
// 返回的是promise对象，点取消销毁组件，点确认销毁组件
export default ({ title, text }) => {
  // 1. 导入被创建的组件
  // 2. 使用createVNode创建虚拟节点
  // 3. 准备一个dom容器装载组件
  // 4. 使用render函数渲染组件到容器
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()// 点击确认按钮，触发resolve同时销毁组件
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))// 点击取消按钮，触发reject同时销毁组件
    }

    // 使用createVNode创建虚拟节点
    // 参数：组件名字，标题，文字，确认fun,取消fun
    const vn = createVNode(XtxConfirm, { title, text, cancelCallback, submitCallback })
    render(vn, div) // 使用render函数渲染组件到容器
  })
}
