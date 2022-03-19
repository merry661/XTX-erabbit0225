<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <!-- 已登录 -->
        <li>
          <router-link to="/member">
            <i class="iconfont icon-user">
            </i>{{profile.account}}
          </router-link>
        </li>
        <li><a href="javascript:;" @click="logout()">退出登录</a></li>
        </template>

     <template v-else>
       <!-- 未登录 -->
         <li>
           <router-link to="/login">请先登录</router-link>
         </li>
        <li><a href="javascript:;">免费注册</a></li>
     </template>

        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
// 引入vue
import { computed } from 'vue'
// 引入vuex
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'AppTopnav',
  setup () {
    const router = useRouter()
    const store = useStore()// 使用vuex中的state需要设置计算属性，否则不是响应式
    // 1.获取用户信息
    const profile = computed(() => {
      return store.state.user.profile
    })

    // 2.点击退出登录
    const logout = () => {
      // 1)清空vuex的userInfo
      const profile = {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
      store.commit('user/setUserInfo', profile)
      store.commit('cart/setCartList', [])// 清空购物车
      router.push('/login') // 2)跳转到登录页面
    }

    return { profile, logout }
  }
}
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
