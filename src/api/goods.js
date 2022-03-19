// 商品详情
import request from '@/utils/request'

/**
 * 1、获取商品同类推荐-未传入ID为猜喜欢
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}
/**
 * 2.获取热榜商品
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}
/**
 * 3.获取商品的评价统计信息
 * @param {String} id - 商品ID
 */
// 例子：https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
export const findCommentInfoByGoods = (id) => {
  return request(`/goods/${id}/evaluate`, 'get')
}
/**
 * 4.获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}
