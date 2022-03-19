// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址，原因：有些请求不是通过axios发请求的，用该基准地址
// export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net'
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

// 创建一个新的axios实例
const instance = axios.create(
  { // 配置axios
    baseURL,
    timeout: 5000
  }
)

instance.interceptors.request.use((config) => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  // 1.获取用户信息
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`// 3. 设置token
  }
  return config
}, (err) => {
  // 请求失败
  return Promise.reject(err)
})

instance.interceptors.response.use((res) => {
  // 响应成功，直接返回数据，剥离无效数据
  return res.data
}, (err) => { // 响应失败
  if (err.response && err.response.status === '401') {
    // 1. 清空无效 用户信息
    // 2. 跳转到登录页
    // 3. 跳转需要传参（当前路由地址）给登录页码
    store.commit('user/setUserInfo', {})
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)// url转码
    router.push('/login?redirectUrl=' + fullPath)
  }

  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
