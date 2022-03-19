<template>
  <XtxDialog :title="(formData.id ? '编辑' : '添加')+'收货地址'" v-model:visible="dialogVisible">
    <div class="address-edit">
        <div class="xtx-form">
            <div class="xtx-form-item">
                <div class="label">收货人：</div>
                <div class="field">
                <input class="input" placeholder="请输入收货人" v-model="formData.receiver"/>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">手机号：</div>
                <div class="field">
                <input class="input" placeholder="请输入手机号" v-model="formData.contact"/>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">地区：</div>
                <div class="field">
                <XtxCity
                :fullLocation="formData.fullLocation"
                placeholder="请选择所在地区"
                @changeCityData="changeCity"/>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">详细地址：</div>
                <div class="field">
                <input class="input" placeholder="请输入详细地址" v-model="formData.address" />
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">邮政编码：</div>
                <div class="field">
                <input class="input" placeholder="请输入邮政编码" v-model="formData.postalCode"/>
                </div>
            </div>
            <div class="xtx-form-item">
                <div class="label">地址标签：</div>
                <div class="field">
                <input class="input" placeholder="请输入地址标签，逗号分隔" v-model="formData.addressTags"/>
                </div>
            </div>
        </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right:20px" @click="dialogVisible = false">取消</XtxButton>
      <XtxButton type="primary" @click="submit()">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 1.定义一个open函数，做为打开对话框函数(组件实例拥有open函数)
    const open = (address) => {
      dialogVisible.value = true

      // 传人{}的时候就是清空，否则就是赋值
      //   for (const key in formData) {
      //     formData[key] = address[key]
      //   }
      if (address.id) { // 有id,代表是修改
        for (const key in formData) {
          formData[key] = address[key]
        }
      } else { // 没id，代表是添加
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null// 清空数据
          }
        }
      }
    }

    // 2.表单数据
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      fullLocation: null // 城市组件显示文字（完整行政区地址）
    })

    // 3.选择地区
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    // 4.提交操作
    const submit = () => {
      if (formData.id) {
        // 编辑修改成功
        editAddress(formData).then(data => {
          Message({ text: '修改收货地址成功', type: 'success' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else {
        addAddress(formData).then(data => {
        // 添加成功
          Message({ text: '添加收货地址成功', type: 'success' })
          formData.id = data.result.id
          dialogVisible.value = false
          emit('on-success', formData)
        })
      }
    }
    return { dialogVisible, open, formData, changeCity, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
