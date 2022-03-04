// 封装插件

// 导入失败状态的图片
import { defaultImg } from '@/assets/images/200.png'

// 导入组件
import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'

// 导出install方法
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    defineDirective(app)// 在install中，注册指令
  }
}
// 自定义指令
const defineDirective = (app) => {
  app.directive('lazy', { // 1.创建图片懒加载指令 lazy

    mounted (el, binding) {
      console.log(el, binding, '000')

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
