// 顶级分类接口
import request from '@/utils/request'

// 1.获取首页头部 顶级分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 2.获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */

export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
/**
 * 3.获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}
/**
 * 4.获取分类下的商品（带筛选条件）
 * @param {Object} params - 可参考接口文档
 */
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
