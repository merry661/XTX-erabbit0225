// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      redirectUrl: '/'// 登录后回跳路径
    }
  },
  mutations: {
    //   1.修改用户信息,payload就是用户信息对象
    setUserInfo (state, payloud) {
      state.profile = payloud
    },
    setRedirectUrl (state, url) {
      state.redirectUrl = url// 修改回跳地址
    }
  }
}
