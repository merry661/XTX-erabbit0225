<template>
    <!-- 商品详情-城市组件 -->
  <div class="xtx-city" ref="containerOther">
    <div class="select" @click="toggleDialog()" :class="{active}">

      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>

    </div>

    <!-- 选项部分 -->
    <div class="option" v-if="active">
        <!-- loading效果 -->
        <div class="loading" v-if="loading"></div>
        <template v-else>
            <span class="ellipsis"
            @click="changeItem(item)"
            v-for="item in currList"
            :key="item.code">
            {{item.name}}
          </span>
        </template>
    </div>
  </div>
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      defulat: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 1.控制展开，收起，默认收起
    const active = ref(false)// 显示隐藏数据
    const loading = ref(false)// 正在加载数据
    const cityData = ref([]) // 所有省市区数据
    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    const openDialog = () => { // 打开弹框
      active.value = true
      loading.value = true

      // 5.获取城市数据,显示当前地方列表
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
    }

    const closeDialog = () => { // 关闭弹框
      active.value = false
    }
    // 2.切换展开收起，给select使用
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 3.点击其他位置，隐藏展开
    // onClickOutside()方法可以排除某个dom，获取它之外的dom
    const containerOther = ref(null)// select 和弹层区域
    onClickOutside(containerOther, () => {
      // 参数1：监听那个元素
      // 参数2：点击了该元素外的其他地方触发的函数
      closeDialog()
    })

    // 6.计算属性：获取当前显示的地区数组
    const currList = computed(() => {
      // 默认省一级，可选市一级，可选县地区一级
      let list = cityData.value
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }

      console.log(list)
      return list
    })

    // 7.当你点击按钮的时候记录
    const changeItem = (item) => {
      if (item.level === 0) { // 省
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) { // 市
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) { // 地区
        changeResult.countyCode = item.code
        changeResult.countyName = item.name

        // 最后一级：1）赋值完整路径，2）关闭对话框，3）通知父组件数据
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        closeDialog()
        emit('changeCityData', changeResult)
      }
    }

    return { toggleDialog, containerOther, loading, currList, active, changeItem }
  }
}
// 4.获取城市数据
const getCityData = () => {
  // 1）调用接口
  // 2）将数据存入缓存
  return new Promise((resolve, reject) => {
    if (window.cityData) { // 有缓存
      resolve(window.cityData)
    } else { // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then((res) => {
        console.log(res, '配送地址')
        window.cityData = res.data// 存入缓存
        resolve(window.cityData)
      })
    }
  })
  // 3）定义计算属性，根据点击的省份城市展示
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }

    // 加载效果
    .loading{
        height: 290px;
        width: 100%;
        background: url(~@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
