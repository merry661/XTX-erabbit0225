<template>
 <!-- 提取头部分类导航组件，提供给头部，和将来的吸顶头部使用 -->
    <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>

    <li v-for="item in categoryList" :key="item.id" @mouseenter="show1(item)"  @mouseleave="hide1(item)">
        <router-link :to="`/category/${item.id}`" @click="hide1(item)">{{item.name}}</router-link>

        <div class="layer" :class="{open:true}">  <!-- 鼠标滑过a标签，出现layer弹层 -->
            <ul>
                <li v-for="subItem in item.children" :key="subItem.id">
                  <router-link :to="`/category/sub/${subItem.id}`" @click="hide1(item)">
                       <img :src="subItem.picture">
                       <p>{{subItem.name}}</p>
                  </router-link>
                </li>
            </ul>
        </div>
    </li>

  </ul>
</template>

<script>
// 引入vuex
import { useStore } from 'vuex'
// 引入vue
import { computed } from 'vue'
export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()

    // 1.获取全部导航菜单项
    const categoryList = computed(() => {
      return store.state.category.list
    })

    // 2.修改二级菜单的显隐
    const show1 = (item) => {
      store.commit('category/show', item)
    }
    const hide1 = (item) => {
      store.commit('category/hide', item)
    }
    return { categoryList, show1, hide1 }
  }
}
</script>

<style scoped lang='less'>
.app-header-nav {
  width: 820px;
  display: flex;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  >li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    >a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      >a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
    // 鼠标滑过nav一级标题,显示二级菜单弹层
        // .layer{
        //     height: 132px;
        //     opacity: 1;
        // }
        >.layer{
            &.open{
                height: 132px;
                opacity: 1;
            }
        }
    }
  }
// 弹层
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 6px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
}
</style>
