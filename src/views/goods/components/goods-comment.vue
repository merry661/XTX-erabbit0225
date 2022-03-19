<template>
<!-- 商品详情-评价组件 -->
  <div class="goods-comment">

    <!-- 评价--头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>

      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">

          <a
            v-for="(item,index) in commentInfo.tags"
            :key="item.title" href="javascript:;"
            :class="{active:currTagIndex === index}"
            @click="changeTag(index)"
          > {{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a href="javascript:;"  @click="changeSort(null)" :class="{active:reqParams.sortField===null}">默认</a>
      <a href="javascript:;" @click="changeSort('praiseCount')" :class="{active:reqParams.sortField==='praiseCount'}">最新</a>
      <a href="javascript:;" @click="changeSort('createTime')" :class="{active:reqParams.sortField==='createTime'}">最热</a>
    </div>

    <!-- 商品详情-评价组件-实现列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <!-- 头像 -->
          <img :src="item.member.avatar" alt="">
          <!-- 用户名 -->
           <span>{{formatNickname(item.member.nickname)}}</span>
        </div>

        <div class="body">
            <!-- 小星星 -->
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="i in tem.score" :key="i+'s'"></i>
            <i class="iconfont icon-wjx02" v-for="i in 5-item.score" :key="i+'k'"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 使用图片预览组件 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures" />

          <div class="time">
            <span>{{item.createTime}}</span>

            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <XtxPagination v-if="total" @current-change="changePager" :total="total" :current-page="reqParams.page" ></XtxPagination>
  </div>
</template>
<script>
import { findCommentInfoByGoods } from '@/api/goods'
import { ref, inject, reactive, watch } from 'vue'
import GoodsCommentImage from './goods-comment-image'
const getCommentInfo = (goods) => {
  const commentInfo = ref(null)

  findCommentInfoByGoods(goods.value.id).then(({ result }) => {
    if (result) {
      // type 的目的是将来点击可以区分 点击的是不是标签
      result.tags.unshift({ type: 'img', title: '有图', tagCount: result.hasPictureCount })
      result.tags.unshift({ type: 'all', title: '全部评价', tagCount: result.evaluateCount })
      commentInfo.value = result
    }
  })
  return commentInfo
}
export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    const currTagIndex = ref(0) // 记录当前激活的索引
    const goods = inject('goods')
    const commentInfo = getCommentInfo(goods)// 获取评价信息

    // 2.评价列表的筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null // 排序方式：praiseCount 热度  createTime 最新
    })

    // 3. 改变排序
    // 参数：
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      reqParams.page = 1// 筛选或排序改变后页码回到第一页
    }
    // 1.点击按钮，显示不同list
    const changeTag = (i) => {
      currTagIndex.value = i
      // 点击tag按钮的时候修改筛选条件
      const tag = commentInfo.value.tags[i]
      // 情况1：全部评价
      // 情况2：有图
      // 情况3：正常tag
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }

      reqParams.page = 1// 筛选或排序改变后页码回到第一页
    }

    // 4. 初始化或者筛选条件改变后，获取列表数据
    const commentList = ref([])// 评价列表
    const total = ref(0)// 总条目数
    watch(reqParams, async () => {
      const data = await findCommentInfoByGoods(goods.value.id, reqParams)
      console.log(data, '4444')
      commentList.value = data.result.items
      total.value = data.result.counts
    }, { immediate: true })

    // 5.定义转换数据的函数（对应vue2.0的过滤器）
    const formatSpecs = (specs) => { // 格式化评价描述
      return specs.reduce((p, c) => {
        return (`${p} ${c.name}:${c.nameValue}`, '')
      }).trim()
    }
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // 6.分页:改变分页
    const changePager = (np) => {
      reqParams.page = np
    }
    return {
      total,
      changePager,
      commentInfo,
      currTagIndex,
      changeTag,
      reqParams,
      changeSort,
      formatSpecs,
      formatNickname,
      commentList
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
}
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
</style>
