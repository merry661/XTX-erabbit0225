<template>
   <div class="top-category">
      <div class="container">
          <SubBread></SubBread> <!-- 面包屑 -->
          <!-- 筛选区 -->
          <SubFilter @filterChange="filterChange"/>
          <!-- 结果区域 -->
         <div class="goods-list">
            <!-- 排序 -->
            <SubSort  @sorChange="sortChange"/>
            <!-- 列表 -->
            <ul>
               <li v-for="item in goodsList" :key="item.id" >
                  <GoodsItem :goods="item" />
               </li>
            </ul>

            <!-- 下拉加载效果 -->
            <XtxInfiniteLoading
             :loading="loading"
             :finished="finished"
             @infinite="getData"
            />
         </div>
      </div>
   </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'

import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem },
  setup () {
    // 1. 基础布局
    // 2. 无限加载组件
    // 3. 动态加载数据且渲染
    // 4. 任何筛选条件变化需要更新列表
    const route = useRoute()

    const loading = ref(false)// 加载中
    const finished = ref(false)// 是否加载完毕

    const goodsList = ref([]) // 商品列表数据

    // 请求参数，分页
    let reqParams = {
      page: 1,
      pageSize: 20
    }

    // 1.调用接口，获取数据
    const getData = () => {
      loading.value = true
      // 设置二级分类的ID
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        console.log('ooooooooooooo')
        // 获取数据成功
        if (result.items.length) {
          // 有数据就追加数据
          goodsList.value.push(...result.items)
          // 把page改成下一页页码
          reqParams.page++
        } else {
          // 没有数据，代表加载完成
          finished.value = true
        }
        loading.value = false
      })
    }

    // 2.更改了二级分类的时候需要重新加载数据
    watch(() => route.params.id, (newId) => {
      if (newId && `/category/sub/${newId}` === route.path) {
        finished.value = false// 加载未完成
        goodsList.value = [] // 导致列表空的，加载更多组件顶上来，进入可视区，区加载数据
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 3.更改排序组件的筛选数据，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []

      // 再次调用接口
      getData()
    }
    // 4.更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      finished.value = false
      // 合并请求参数，保留之前参数
      reqParams = { ...reqParams, ...filterParams }
      goodsList.value = []
      getData()
    }
    return { loading, finished, getData, goodsList, sortChange, filterChange }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
