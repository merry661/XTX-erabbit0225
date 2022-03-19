<template>
<!-- 复选框组件封装 -->
<div class="xtx-checkbox" @click="changeChecked()">
    <!-- 选中效果的框 -->
    <i v-if="checked" class="iconfont icon-checked"></i>

    <!-- 未被选中的效果框 -->
    <i v-else class="iconfont icon-unchecked"></i>

    <!-- 文字 -->
    <span v-if="$slots.default"><slot></slot></span>
</div>
</template>
<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  // 1.实现双向绑定v-model=>  :modelValue  +   @update:modelValue
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // const checked = ref(false)
    // const changeCh    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')ecked = () => {
    //   checked.value = !checked.value // 每次点击复选框，切换checked值
    //   // 1.1传值：使用emit通知父组件数据的改变
    //   emit('update:modelValue', checked.value)
    // }

    // // 1.2取值：使用侦听器，得到父组件传递数据，给checked数据
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, {
    //   immediate: true
    // })
    // 使用useVModel实现双向数据绑定v-model指令
    // 1. 使用props接收modelValue
    // 2. 使用useVModel来包装props中的modelValue属性数据
    // 3. 在使用checked.value就是使用父组件数据
    // 4. 在使用checked.value = '数据' 赋值，触发emit('update:modelvalue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      emit('change', newVal)
    }
    return { checked, changeChecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
