import request from '@/utils/request'

// 首页
// 1.获取品牌数据
export const getHotBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

// 2.获取广告图
export const getBanners = () => {
  return request('/home/banner', 'get')
}

// 3.获取 新鲜好物
export const getNews = (limit = 4) => {
  return request('/home/new', 'get', { limit })
}

// 4.获取人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}

// 5.首页-产品区块
export const findGoods = () => {
  return request('home/goods', 'get')
}

// 6.最新专题
export const findSpecial = () => {
  return request('home/special', 'get')
}
