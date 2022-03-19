// 购物车状态
import {
  insertCart, getNewCartGoods, mergeLocalCart,
  checkAllCart, deleteCart, findCartList, updateCart
} from '@/api/cart'
export default {
  namespaced: true,
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  state: () => {
    return {
      list: []
    }
  },
  // 使用getters得到有效商品列表和期种件数
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock < 0 || !item.isEffective)
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => {
        return p + Math.round(c.nowPrice * 100) * c.count
      }, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      // 有效商品数量不为0 且 选中商品列表数量= 有效商品数量
      return getters.validList.length !== 0 &&
      getters.selectedList.length === getters.validList.length
    }
  },
  mutations: {
    // 1.加入购物车
    insertCartM (state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
      // 3. 如果没有相同商品，追加该新商品
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)// 比较库存信息
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        state.list.splice(sameIndex, 1)// 原来商品需要删除
      }
      state.list.unshift(payload) // 追加新的
    },

    // 2.修改购物车商品
    updateCart (state, goods) {
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)

      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 3.删除购物车
    deleteCart (state, skuId) {
      const indexD = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(indexD, 1)
    },
    // 4.设置购物车列表
    setCartList (state, list) {
      state.list = list
    }

  },
  actions: {
    // 1.加入购物车
    insertCartAc (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) { // rootState:根state;//已登录,调用接口
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else { // 未登录
          ctx.commit('insertCartM', payload)
          resolve()
        }
      })
    },
    // 2.获取购物车列表
    findCartList (context) {
      return new Promise((resolve, reject) => {
        // 要找到根模块的state
        // 区分是否已经登录
        if (context.rootState.user.profile.token) {
          // 有token就是登录了
          findCartList().then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 获取当前模块的state
          const promiseArr = context.state.list.map(item => {
            return getNewCartGoods(item.skuId)// 调用接口，获取新的商品信息
          })

          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => { // 更新本地购物车
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            // 调用resolve代表操作成功
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    },
    // 3.删除购物车某个商品
    deleteCart (context, skuId) {
      return new Promise((resolve, reject) => {
        // 区分是否已经登录
        if (context.rootState.user.profile.token) {
          deleteCart([skuId]).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 4.1  修改购物车（选中状态，数量）
    updateCart (ctx, payload) {
      // payload 需要：必需有skuId  可能：selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 4.修改购物车商品的规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 原先商品的数量+新skuId
          // 4. 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品数据
          // 4. 添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 5.做有效商品的全选&反选
    checkAllCart (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          context.getters.validList.forEach(item => {
            context.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 6.批量删除选中商品
    batchDeleteCart (context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 有token就是登录了
          const ids = context.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList()
          }).then(data => {
            context.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 1. 获取选中的商品列表，遍历列表，且调用deleteCart mutataions函数
          // context.getters.selected.forEach(item => {
          context.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
        }
      })
    },

    // 7.合并购物车后，清空本地
    async mergeLocalCart (context) {
      // 调用接口，获取登录后的购物车数据
      // 合并本地和接口的购物车数据
      const cartList = context.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })

      await mergeLocalCart(cartList)
      context.commit('setCartList', []) // 合并成功将本地购物车删除
    }
  }
}
