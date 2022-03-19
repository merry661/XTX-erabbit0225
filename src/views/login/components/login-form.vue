<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>

    <Form class="form" ref="formCom" :validation-schema="mySchema" autocomplete="off" v-slot="{errors}">
    <!-- 其实就是把input改成 Field 组件，默认解析成input
    Field 添加name属性，作用是指定使用schema中哪个校验规则
    Form 添加 v-slot="{errors}" 使用作用域插槽暴露 errors 错误对象
    通过 errors['校验规则名称'] 取出错误信息，有则显示，无即隐藏 -->
    <!-- <div class="form"> -->
        <template v-if="!isMsgLogin">
            <!-- 账号+密码 -->
            <div class="form-item">
                <div class="input">
                    <i class="iconfont icon-user"></i>
                    <Field :class="{error:errors.account}" v-model="form.account"
                    name="account" type="text" placeholder="请输入用户名" />
                </div>
                <div class="error" v-if="errors.account">
                    <i class="iconfont icon-warning" />
                    {{errors.account}}</div>
            </div>

            <div class="form-item">
            <div class="input">
                <i class="iconfont icon-lock"></i>
                <Field :class="{error:errors.password}" v-model="form.password"
                  name="password" type="password" placeholder="请输入密码" />
            </div>
             <div class="error" v-if="errors.password">
                 <i class="iconfont icon-warning" />
            {{errors.password}}</div>
            </div>

        </template>
        <template v-else>
            <!-- 手机号+验证码 -->
            <div class="form-item">
                <div class="input">
                    <i class="iconfont icon-user"></i>
                    <Field
                        :class="{ error: errors.mobile }"
                        v-model="form.mobile"
                        name="mobile"
                        type="text"
                        placeholder="请输入手机号"
                    />
                </div>
               <div class="error" v-if="errors.mobile">
                    <i class="iconfont icon-warning" />
                    {{errors.mobile}}</div>
            </div>
            <div class="form-item">
            <div class="input">
                <i class="iconfont icon-code"></i>
                  <Field :class="{error:errors.code}" v-model="form.code"
                  name="code" type="password" placeholder="请输入验证码" />

                <span @click="send()" class="code">
                    {{timeSMS === 0 ? '发送验证码' : `${timeSMS}秒后发送`}}
                </span>
            </div>
            <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
            </div>
        </template>

        <div class="form-item">
            <div class="agree">
            <!-- <XtxCheckbox v-model="form.isAgree" /> -->
            <!-- Field 的 as 属性可以指定为其他标签，也可指定为组件。
            但是组件需要支持 v-model 否则校验不会触发。 -->
            <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree"/>
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
            </div>
        </div>
        <a href="javascript:;" class="btn" @click="login()">登录</a>
        <!-- <XtxMessage text="手机号或密码错误" type="error" /> -->
        <!-- </div> -->
    </Form>

    <div class="action">
        <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
          <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" />
        </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
// import QC from 'qc'
// 提示框函数
import Message from '@/components/library/Message'
// 导入接口
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
// 表单校验
import schema from '@/utils/vee-validate-schema'

export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const isMsgLogin = ref(false)// 1.是否是短信登录
    const form = reactive({ // 2.表单信息对象
      isAgree: true,
      account: 'xiaotuxian001',
      password: '123456',
      mobile: null,
      code: null
    })

    // 3.校验规则对象
    // vee-validate 校验基本步骤
    // 1. 导入 Form Field 组件 将 form 和 input 进行替换，需要加上name用来指定将来的校验规则函数的
    // 2. Field 需要进行数据绑定，字段名称最好和后台接口需要的一致
    // 3. 定义Field的name属性指定的校验规则函数，Form的validation-schema接受定义好的校验规则是对象
    // 4. 自定义组件需要校验必须先支持v-model 然后Field使用as指定为组件名称
    const mySchema = {
      // 校验函数规则：返回true就是校验成功，返回一个字符串就是失败，字符串就是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 4.切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)// From DOM
    watch(isMsgLogin, () => { // 如果监听到isMsgLogin变化,就清空表单数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })

    // 5.点击登录按钮
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      // 1)对整体表单进行校验
      // 2)Form组件提供了一个 validate 函数作为整体表单校验，返回的是一个promise
      const valid = await formCom.value.validate()
      if (valid) { // 表单验证通过
        if (!isMsgLogin.value) { // 帐号密码登录,调用接口(参数:表单信息对象)
          const { account, password } = form

          userAccountLogin({ account, password }).then(data => {
            const { id, account, nickname, avatar, token, mobile } = data.result // 1. 存储信息
            store.commit('user/setUserInfo',
              { id, account, nickname, avatar, token, mobile })

            // 合并购物车信息
            store.dispatch('cart/mergeLocalCart').then(() => {
              router.push(route.query.redirectUrl || '/') // 进行跳转
              Message({ type: 'success', text: '登录成功啦~~~~' }) // 成功消息提示
            })
            // Message({ type: 'success', text: '登录成功' }) // 2. 提示
            // router.push(route.query.redirecUrl || '/')// 3. 跳转
          }).catch(e => {
            console.log(e)
            if (e.response) {
              Message({ type: 'error', text: e.response.data.message || '登录失败' })
            }
          })
        } else { // 手机号登录+验证码登录
          // 短信登录
          // 1. 定义两个API  短信登录，获取短信验证码
          // 2. 实现发送短信验证码发送功能
          // 3. 完成手机号短信验证码登录逻辑
          const { mobile, code } = form
          userMobileLogin({ mobile, code }).then(data => {
            const { id, account, nickname, avatar, token, mobile } = data.result // 1. 存储信息
            store.commit('user/setUserInfo', { id, account, nickname, avatar, token, mobile })

            // 合并购物车信息
            store.dispatch('cart/mergeLocalCart').then(() => {
              router.push(route.query.redirectUrl || '/') // 进行跳转
              Message({ type: 'success', text: '登录成功啦~~~~' }) // 成功消息提示
            })

            // Message({ type: 'success', text: '登录成功' }) // 2. 提示
            // router.push(route.query.redirecUrl || '/')// 3. 跳转
          }).catch(e => {
            console.log(e)
            if (e.response) {
              Message({ type: 'error', text: e.response.data.message || '登录失败' })
            }
          })
        }
      }
    }

    // 6.发送验证码，需要校验手机号，和判断是否60秒内，方可发送
    // useIntervalFn(回调函数,执行间隔,是否立即开启),作用:
    // pause 暂停 resume 开始
    const timeSMS = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      timeSMS.value--
      if (timeSMS.value < 0) {
        pause()
      }
    }, 1000, false)

    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      // 手机号校验合格,且倒计时没结束
      if (valid) {
        if (timeSMS.value === 0) {
          await userMobileLoginMsg(form.mobile)// 请求验证码
          Message({ type: 'success', text: '发送成功' })
          timeSMS.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return { isMsgLogin, form, mySchema, formCom, login, send, timeSMS }
  }
}
</script>
<style scope lang="less">
.account-box { // 账号容器
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
