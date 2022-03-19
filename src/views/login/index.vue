<template>
<!-- 登录模块 -->
  <div class="page-login">
    <!-- 登录头部 LoginHeader 需要留出副标题插槽 -->
    <LoginHeader>欢迎登录</LoginHeader>

    <!-- 登录主体 Login -->
    <section class="login-section">
        <div class="wrapper">
            <nav>
                <a href="javascript:;"
                    :class="{active:tabName === 'account'}"
                    @click="tabName='account'"
                >账户登录</a>

                <a href="javascript:;"
                    :class="{active:tabName === 'qrcode'}"
                    @click="tabName='qrcode'"
                >扫码登录</a>
            </nav>

            <!-- 表单 -->
            <div v-if="tabName === 'account'" class="account-box">
                <LoginForm v-if="tabName==='account'"></LoginForm>
            </div>
            <!-- 二维码 -->
            <div v-if="tabName==='qrcode'" class="qrcode-box">
                 <img src="@/assets/images/qrcode.jpg" alt="">
                 <p>打开<a href="javascript:;">小兔仙APP</a>扫码登录</p>
            </div>
        </div>
    </section>

    <!-- 登录底部 LoginFooter -->
    <LoginFooter />
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import LoginForm from './components/login-form'
export default {
  name: 'LoginPage',
  components: {
    LoginHeader,
    LoginFooter,
    LoginForm
  },
  setup () {
    const tabName = ref('account')
    // 存储回调地址，提供将来QQ回调页使用  setup中
    const store = useStore()
    const route = useRoute()
    store.commit('user/setRedirectUrl', route.query.redirectUrl || '/')
    return { tabName }
  }
}
</script>

<style scoped lang='less'>
.login-section {
  background: url(../../assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px,0,0);
    box-shadow: 0 0 10px rgba(0,0,0,.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active{
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
    // 二维码容器
.qrcode-box {
  text-align: center;
  padding-top: 40px;
  p {
    margin-top: 20px;
    a {
      color: @xtxColor;
      font-size: 16px;
    }
  }
}
  }
}
</style>
