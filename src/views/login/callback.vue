<template>
<!-- 第三方登录--QQ登录,回调页面 -->
  <LoginHeader>联合登录</LoginHeader>
<section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
</section>

<section class="container" v-else>
    <nav class="tab">

      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>

      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind unionId="unionId"/>
    </div>
    <div class="tab-content" unionId="unionId" v-else>
      <CallbackPatch />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
export default {
  name: 'LoginCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const hasAccount = ref(true)
    // const nickname = ref(null)
    // const avatar = ref(null)

    // 首先：默认认为已经注册且已经绑定
    // 通过QQ的API获取openId就是后台需要的unionId然后去进行登录
    // 如果成功：登录成功
    // 如果失败：改QQ未和小兔仙进行绑定（有帐号未绑定QQ，没有帐号未绑定QQ）
    const isBind = ref(true)// 假设已经绑定，默认会去做一次登录，如果登录失败证明未绑定
    const unionId = ref(null)
    // 1.在组件初始化的时候获取openId去登录
    // 1). 获取QQ互联的openId也就是后台需要的unionId
    // 2). 根据QQ互联的openId去进行登录，准备一个接口
    const store = useStore()
    const router = useRouter()
    if (QC.Login.check) { // 检查QQ是否登录
      QC.Login.getMe((openId) => { // 第三方唯一标识QQ唯一标识
        unionId.value = openId
        userQQLogin(openId).then(data => { // 调用接口,做QQ登录
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2. 跳转到来源页或者首页
          // router.push(store.state.user.redirectUrl)

          store.dispatch('cart/mergeLocalCart').then(() => {
          // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(e => {
          // 用qq登录失败===>1. 没绑定小兔鲜帐号  2. 没有小兔鲜帐号
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
