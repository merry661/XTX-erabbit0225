// 顶级分类接口
import request from '@/utils/request'

// 1.获取首页头部 顶级分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
