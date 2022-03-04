<template>
    <!-- 首页-主面板组件 -->
    <div class="home-panel">
        <div class="container">
            <div class="head">

                <!-- 主标题，副标题 -->
                <h3>{{title}}<small>{{subTitle}}</small></h3>
                <slot name="right"></slot><!-- 右侧部分（查看更多/图标） -->
            </div>

            <!-- 默认插槽，版面内容部分 -->
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
  name: 'HomePanel',
  props: {
    // 主标题
    title: {
      type: String,
      default: ''
    },
    // 副标题
    subTitle: {
      type: String,
      default: ''
    }
  },
  setup () {

  }
}
</script>
<style scoped lang='less'>
.home-panel {
  background-color: #fff;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
