
import { userAccountCheck } from '@/api/user'

// 定义校验规则,提供给vee-validate组件使用
export default {
  // 1. 校验account
  // value是将来使用该规则的表单元素的值
  // 1. 必填
  // 2. 6-20个字符，需要以字母开头
  // 如何反馈校验成功还是失败，返回true才是成功，其他情况失败，返回失败原因。
  account (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且5-20个字符'

    return true
  },
  // 2.校验密码
  password (value) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  // 3.手机号
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[3,5,7,9,8][0-9]{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  // 4.验证码
  code (value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
  },
  // 5.是否同意
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  },
  // 6. 用户名校验且校验唯一性
  async accountApi (value) {
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
    // 服务器端校验
    const data = await userAccountCheck(value)
    if (data.result.valid) return '用户名已存在'
    return true
  },
  // 7.密码校验 对比
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码6-24个字符'
    // 校验密码是否一致  form表单数据对象
    if (value !== form.password) return '两次输入的密码不一致'
    return true
  }
}
