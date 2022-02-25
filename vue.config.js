// 引入path
const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 需要注入的文件配置一下后，重启服务即可
        // 文件自动化引入，使用绝对路径，需要path.join来来拼接完整路径
        path.join(__dirname, './src/assets/style/variables.less'),
        path.join(__dirname, './src/assets/style/mixins.less')
      ]
    }
  }
}
