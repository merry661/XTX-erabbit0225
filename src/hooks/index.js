// 封装一个钩子函数,实现懒数据加载

// hooks 封装逻辑，提供响应式数据
// 引入组件懒加载函数
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
// 1.自定义 数据懒加载函数
// 参数：API函数名字
export const useLazyData = (apiFn) => {
  const target = ref(null)// 2.被监听的dom,表示组件的”最外层div元素“
  const result = ref([])// 接口返回数据

  const { stop } = useIntersectionObserver(// 监听组件是否进入可视区
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) { // 如果target对应的DOM进入可视区，就触发该回调函数
        stop()// 停止继续监听target对应的dom

        apiFn && apiFn().then(data => { // 3.调用API获取数据
          result.value = data.result
        })
      }
    },
    // 配置选项，相交的比例大于0就触发
    {
      threshold: 0
    }
  )
  // result表示接口获取的业务数据
  // target表示被监听的DOM元素，需要在模板中被ref属性绑定
  return { target, result }
}

// 2.倒计时钩子函数封装
export const usePayTime = () => {
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')

    if (time.value <= 0) {
      pause()// 暂停
    }
  }, 1000, false)

  onUnmounted(() => {
    pause()// 销毁
  })

  // 开启定时器--参数：倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
