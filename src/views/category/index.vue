<template>
<!-- 商品分类组件 -->
   <div class="top-category">
      <div class="container">
        <!-- 面包屑 -->
        <XtxBread>
         <XtxBreadItem to="/">首页</XtxBreadItem>
          <Transition name="fade-right" mode="out-in">
              <XtxBreadItem :key="topCategory.id" v-if="topCategory.id">{{topCategory.name}}</XtxBreadItem>
          </Transition>
        </XtxBread>

        <!-- 轮播图 -->
        <XtxCarousel :slider="bannners" style="height:500px" />

        <!-- 所有二级分类 -->
         <div class="sub-list">
            <h3>全部分类</h3>
            <ul>
              <li v-for="sub in topCategory.children" :key="sub.id">
                <a href="javascript:;">
                  <img :src="sub.picture" >
                  <p>{{sub.name}}</p>
                </a>
              </li>
            </ul>
        </div>

        <!-- 不同分类商品 -->
          <div class="ref-goods" v-for="item in subList" :key="item.id">
            <div class="head">
               <h3>- {{item.name}} -</h3>
               <p class="tag">{{item.desc}}</p>
              <XtxMore />
            </div>
            <div class="body">
              <GoodsItem v-for="g in item.goods" :key="g.id" :goods="g"/>
            </div>
        </div>

      </div>
   </div>
</template>
<script>
// 引入子组件
import GoodsItem from './components/goods-item'

// 引入接口
import { getBanners } from '@/api/home'
import { findTopCategory } from '@/api/category'

import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // 1.调用接口获取轮播图数据
    const bannners = ref([])
    getBanners().then((data) => {
      bannners.value = data.result
    })

    // 2.面包屑+所有子分类 ====> vuex
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      // 当前顶级分类 === 根据路由上的ID去vuex中category模块的list中查找
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      // 找到数据赋值
      if (item) cate = item
      return cate
    })
    // 3.推荐商品
    const subList = ref([])
    const getSubList = () => {
      // 调用接口
      findTopCategory(route.params.id).then(data => {
        subList.value = data.children
      })
    }

    // 4.监听:url中id,根据不同的id调用接口 显示不同的分类商品
    watch(() => route.params.id, (newVal) => {
      // newVal && getSubList() // newVal && getSubList() 加上一个严谨判断，在顶级类名下才发请求
      if (newVal && `/category/${newVal}` === route.path) getSubList()
    }, {
      immediate: true
    })
    return { bannners, subList, topCategory }
  }

}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      min-height: 160px;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 推荐商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }

  // 分类商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
