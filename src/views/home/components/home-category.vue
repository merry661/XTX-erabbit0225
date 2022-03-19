<template>
<!-- 首页-左侧菜单组件 -->
  <div class='home-category' @mouseleave="categoryId = null">
    <ul class="menu">
      <li v-for="item in categoryList"
        :key="item.id"
        @mouseenter="categoryId=item.id"
        :class="{ active: categoryId && categoryId === item.id }"
      >
        <RouterLink to="/">{{item.name}}</RouterLink>

        <template v-if="item.children">
            <RouterLink
            v-for="subItem in item.children" :key="subItem.id" to="/">{{subItem.name}}</RouterLink>
        </template>

        <!-- 左侧分类骨架效果 -->
        <span v-else>
            <XtxSkeleton width="60px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)"></XtxSkeleton>
            <XtxSkeleton width="60px" height="18px" bg="rgba(255,255,255,0.2)"></XtxSkeleton>
        </span>
      </li>
    </ul>

      <!-- 弹层 -->
    <div class="layer">
      <h4 v-if="currCategory">{{currCategory.id ==="brand"? "品牌":"分类"}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>

      <ul v-if="currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink to="/">
             <img :src="item.picture" alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

        <!-- 品牌推荐-弹层 -->
        <ul v-if="currCategory && currCategory.brands && currCategory.brands.length">
            <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
                <RouterLink to="/">
                    <img :src="brand.picture" alt="">
                    <div class="info">
                    <p class="place"><i class="iconfont icon-dingwei"></i>{{brand.place}}</p>
                    <p class="name ellipsis">{{brand.name}}</p>
                    <p class="desc ellipsis-2">{{brand.desc}}</p>
                    </div>
                </RouterLink>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
// 导入vuex
import { useStore } from 'vuex'
// 引入vue
import { computed, reactive, ref } from 'vue'
// 引入接口
import { getHotBrand } from '@/api/home.js'

export default {
  name: 'HomeCategory',

  setup () {
    const store = useStore()

    // 1.声明一个品牌数据
    const brand = reactive({
      id: 'brand',
      name: '品牌',
      children: [
        { id: 'brand-children', name: '品牌推荐' }
      ],
      brands: []
    })

    // 2.获取分类数据
    const categoryList = computed(() => {
      const list = store.state.category.list.map((item) => {
        // 重新组合分类列表数据
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })

      list.push(brand)
      // console.log(brand, 'pp')
      return list
    })

    // 3.获取推荐商品数据
    // 声明左侧菜单项的id
    const categoryId = ref(null)
    const currCategory = computed(() => {
      const list = categoryList.value.find((item) => item.id === categoryId.value)
      // console.log(list, '8888888')
      return list
    })

    // 4.直接在组件中调用接口,获取热门品牌
    getHotBrand().then((data) => {
      brand.brands = data.result.slice(0, 6)
    })

    return { categoryList, currCategory, categoryId }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
// 弹出层样式
    .layer {
    width: 990px;
    height: 500px;
    background: rgba(255,255,255,0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
              width: 95px;
              height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      // 品牌的样式
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
      z-index: 999;
    }
  }
}

// 骨架动画
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
