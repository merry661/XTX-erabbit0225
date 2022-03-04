// 分类模块

// 导入接口
import { findAllCategory } from '@/api/category'
// 导入常量文件
import { topCategory } from '@/api/constants'
export default {
  namespaced: true,

  state: () => {
    return {
      // 分类信息集合:为避免请求接口前是空白页????
      // list: []
      list: topCategory.map((item) => {
        return { name: item }
      })
    }
  },
  mutations: {
    // 1.调用接口成功后，修改list
    setAllCategoryList (state, payload) {
      state.list = payload
    },

    // 2.修改二级分类的open--显示
    show (state, item) {
      const category = state.list.find((value) => value.id === item.id)
      category.open = true
    },
    // 3.修改二级分类的open--隐藏
    hide (state, item) {
      const category = state.list.find((value) => value.id === item.id)
      category.open = false
    }
  },
  actions: {
    // 1.调用接口，获取首页所有分类数据
    // 参数 context包含:commit,dispatch,getters,state
    async getAllCategoryList (context) {
      // console.log(context, '参数啊')
      const data = await findAllCategory()

      // 给一级分类加上一个控制二级分类显示隐藏的数据open
      data.result.forEach((item) => {
        item.open = false
      })
      context.commit('setAllCategoryList', data.result)// 调用mutations的方法
    }

  }
}
