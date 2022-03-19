<template>
<!-- 面包屑 -->
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem
        v-if="categorys.top"
        :key="categorys.top.id"
        :to="`/category/${categorys.top.id}`"
    >{{categorys.top.name}}</XtxBreadItem>

    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem
        v-if="categorys.sub"
        :key="categorys.sub.id"
      >{{categorys.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'SubBread',
  setup () {
    const route = useRoute() // 1.从url中获取二级分类的ID
    const store = useStore() // 2.二级分类数据,从vuex获取分类数据，进行渲染

    const categorys = computed(() => { // 3. 通过计算属性得到，二级类目的名称和ID，一级类目的名称和ID
      const obj = {}
      // 当前顶级分类 === 根据路由上的ID去vuex中category模块的list中查找
      store.state.category.list.forEach(item => {
        item.children && item.children.forEach((sub) => {
          if (sub.id === route.params.id) { // 有二级分类
            obj.sub = { id: sub.id, name: sub.name }
            obj.top = { id: item.id, name: item.name }
          }
        })
      })
      return obj
    })

    return { categorys }
  }
}
</script>
