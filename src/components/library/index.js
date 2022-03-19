// 封装插件

// 导入失败状态的图片
import { defaultImg } from '@/assets/images/200.png'
// 引入提示框函数
import Message from './Message'
import Confirm from './Confirm'

// 导入组件
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 改进：1.批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)

// 导出install方法
export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // 2. 批量注册全局组件
    importFn.keys().forEach(path => {
      const components = importFn(path).default// 3.根据path批量导入组件
      app.component(components.name, components)// 4.注册组件
    })
    defineDirective(app)// 在install中，注册指令

    // 如果你想挂载全局的属性，能够通过组件实例调用的属性: this.$message
    // vue3.0使用app.config.globalProperties挂载原型方法
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

// 自定义指令
const defineDirective = (app) => {
  app.directive('lazy', { // 1.创建图片懒加载指令 lazy

    mounted (el, binding) {
      // console.log(el, binding)// el:<img>,binding:对象，包含图片地址

      // 2.创建一个观察对象，观察当时 正在使用该指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observe.unobserve(el)

          // 3.把指令的值 设置给el 的src属性，binding.value=指令值
          el.onerror = () => { // 4.处理图片加载失败error事件，load图片加载成功
            el.src = defaultImg// 加载失败，设置默认图
          }

          el.src = binding.value
        }
      }, {
        threshold: 0.01 // 配置选项，相交的比例大于0就触发
      })
      observe.observe(el) // 开启观察
    }
  })
}
