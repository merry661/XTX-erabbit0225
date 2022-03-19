// mockjs模拟接口调用
// 1.引入Mock
import Mock from 'mockjs'
import qs from 'qs'

// 2.配置mock
Mock.setup({
  // 3.延时调用接口
  timeout: '500-1000'
})
// 4. 拦截接口

// 例子1： 参数：接口地址路径(使用正则去匹配，请求方式，返回数据（生成数据的函数
Mock.mock(/\/my\/test/, 'get', () => {
// 随机数据逻辑 目标：5条数据  [{id:'',name:''},...]
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname',
      num: '@integer(0,7)',
      title: '@ctitle(2,4)'
    }))
  }
  return { msg: '获取数据成功', result: arr }
})

// 例子2：模拟 我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  // console.log(queryObject, '8888888888')
  const items = []

  for (let i = 0; i < +queryObject.pageSize; i++) {
    // console.log(+queryObject.pageSize)//加号的意思是把 字符串转换为数字
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }

  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})
