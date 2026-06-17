<template>
  <view class="container">
    <!-- 标题 -->
    <view class="page-title">收货地址</view>
    <!-- 表单组件 -->
    <view class="form-wrapper">
      <tn-form :model="form" ref="form" :rules="rules" label-width="150">
        <tn-form-item label="姓名" prop="name">
          <input placeholder-style="color: #AAAAAA" v-model="form.name" placeholder="请输入收货人姓名" />
        </tn-form-item>
        <tn-form-item label="电话" prop="mobile">
          <input placeholder-style="color: #AAAAAA" v-model="form.mobile" placeholder="请输入收货人手机号" />
        </tn-form-item>
        <tn-form-item label="地区" prop="areaName">
          <view style="display: flex; align-items: center" @tap="showArea = true">
            <input style="flex: 1" v-model="form.areaName" placeholder="选择省市区" disabled readonly />
            <!-- 						<view style="font-size: 40rpx;flex-shrink: 0;margin-left: 20rpx;display: flex;align-items: center;" @click="chooseLocation">
							<text class="tn-icon-location-fill"></text>
							<view style="font-size: 28rpx;margin-left: 10rpx;">定位</view>
						</view> -->
          </view>
          <tn-picker-new mode="region" v-model="showArea" :areaCode="areaCode" @confirm="selectArea"></tn-picker-new>
        </tn-form-item>
        <tn-form-item class="flexTop" label="详细地址" prop="detailAddress" @tap="chooseLocation" v-if="isDisabled">
          <textarea placeholder-style="color: #AAAAAA" v-model="form.detailAddress.split('•')[0]" placeholder="选择详细地址(街道门牌、楼层等信息)" disabled readonly />
        </tn-form-item>
        <tn-form-item class="flexTop" label="详细地址" prop="detailAddress" @tap="chooseLocation" v-else>
          <textarea placeholder-style="color: #AAAAAA" v-model="form.detailAddress.split('•')[0]" @input="getDetailAddress" placeholder="选择详细地址(街道门牌、楼层等信息)" readonly />
        </tn-form-item>
        <tn-form-item label="楼栋门牌" prop="buildingNumber" :border-bottom="false">
          <input placeholderStyle="color: #AAAAAA" v-model="form.buildingNumber" placeholder="请输入楼栋门牌信息" />
        </tn-form-item>
      </tn-form>
    </view>
    <view style="display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx; padding-bottom: 10px; background-color: white; padding: 20rpx 30rpx">
      <view> 设置为默认地址 </view>
      <view>
        <tn-switch v-model="form.defaultStatus" activeColor="#0059FF" @change="form.defaultStatus == !form.defaultStatus"></tn-switch>
      </view>
    </view>
    <!-- 操作按钮 -->
    <view class="footer">
      <view class="btn-wrapper">
        <view class="btn-item btn-item-main" @click="handleSubmit()">保存</view>
      </view>
    </view>
    <tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
  </view>
</template>

<script>
// 表单字段元素
const form = {
  areaId: '',
  areaName: '',
  defaultStatus: false,
  detailAddress: '',
  address_default: false,
  id: '',
  mobile: '',
  name: '',
  lng: '',
  lat: '',
  buildingNumber: '',
}

// 表单验证规则
const rules = {
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['blur', 'change'],
    },
  ],
  mobile: [
    {
      required: true,
      message: '请输入手机号',
      trigger: ['blur', 'change'],
      type: 'number',
    },
    {
      validator: function (rule, value, callback) {
        if (/^1[3-9]\d{9}$/.test(value) == false) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],

  areaName: [
    {
      required: true,
      message: '请选择省市区',
      trigger: ['blur', 'change'],
      type: 'string',
    },
  ],
  detailAddress: [
    {
      required: true,
      message: '请输入详细地址',
      trigger: ['blur', 'change'],
    },
  ],
  buildingNumber: [
    {
      required: true,
      message: '请输入楼栋门牌信息',
      trigger: ['blur', 'change'],
    },
  ],
}

export default {
  data() {
    return {
      form,
      rules,
      areaCode: [],
      showArea: false,
      isDisabled: true,
    }
  },
  onLoad(options) {
    this.getaddressDetail(options.id)
  },
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  onHide() {},
  methods: {
    // 获取当前地址
    getaddressDetail(id) {
      this.$http.getRequest('app-api/member/address/get?id=' + id).then(res => {
        if (res.code == 0) {
          this.form = res.data
        } else {
          this.$refs.tips.show({
            msg: res.msg,
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 1500,
          })
        }
      })
    },
    // 点击确定
    selectArea(e) {
      console.log(e)
      this.form.areaName = e.province.label + ' ' + e.city.label + ' ' + e.area.label
      this.form.areaId = e.area.value
    },
    getDetailAddress(e) {
      console.log(e)
      this.form.detailAddress = e.detail.value
    },
    // 表单提交
    handleSubmit() {
      this.$refs.form
        .validate()
        .then(res => {
          uni.hideToast()
          if (res) {
            let that = this
            that.form.detailAddress = that.form.detailAddress.split('•')[0] + '•' + that.form.buildingNumber
            that.$http.putRequest('app-api/member/address/update', {}, that.form).then(res => {
              if (res.code == 0) {
                that.$refs.toast.show({
                  title: '操作成功',
                  icon: 'success',
                  image: '',
                  duration: 1000,
                })
                setTimeout(() => {
                  uni.navigateBack()
                }, 1000)
              } else {
                that.$refs.tips.show({
                  msg: res.msg,
                  backgroundColor: '#E83A30',
                  fontColor: '#FFFFFF',
                  duration: 1500,
                })
              }
            })
          }
        })
        .catch(err => {
          console.log('表单错误信息：', err)
        })
    },
    //获取定位
    chooseLocation() {
      let that = this
      var QQMapWX = require('@/libs/qqmap-wx-jssdk.js')
      // 初始化SDK，传入API密钥
      var qqmapsdk = new QQMapWX({
        key: 'LR5BZ-LE4KW-44ZRZ-YV24Q-6BCR5-GNFEH', // 必填
      })
      uni.chooseLocation({
        // latitude:that.form.lat*1,
        // longitude:that.form.lng*1,
        success: function (res) {
          console.log(res)
          console.log('位置名称：' + res.name)
          console.log('详细地址：' + res.address)
          console.log('纬度：' + res.latitude)
          console.log('经度：' + res.longitude)
          that.form.detailAddress = res.name || res.address
          that.form.lng = res.longitude.toString()
          that.form.lat = res.latitude.toString()
          // qqmapsdk.reverseGeocoder({
          //    location: {
          // 							latitude: res.latitude,
          // 							longitude: res.longitude
          // 						}, // 经纬度对象，eg: {latitude: 39.904989, longitude: 116.405285}
          //    success: function(res) {
          //      // 处理成功结果
          //      if (res.result && res.result.address) {
          // 							  console.log('res',res)
          // 							that.form.areaName = res.result.address_component.province + ' ' + res.result.address_component.city + ' ' + res.result.address_component.district
          // 							that.form.detailAddress = res.result.address_reference.landmark_l2.title
          // 							that.form.areaId = res.result.ad_info.adcode
          //      } else {
          // 							 console.log('逆地址解析失败')
          //      }
          //    },
          //    fail: function(err) {
          //      // 处理失败情况
          //      console.log('err',err);
          //    }
          //  });
        },
        complete: function (res) {},
        fail: function (res) {
          console.log(res)
          that.isDisabled = false
          that.checkAddressPermission()
        },
      })
    },

    checkAddressPermission() {
      let that = this
      uni.getSetting({
        success(res) {
          console.log(res)
          if (!res.authSetting['scope.userLocation']) {
            uni.showModal({
              title: '提示',
              content: '请开启地理位置权限',
              success(modalRes) {
                if (modalRes.confirm) {
                  uni.openSetting() // 跳转权限设置页
                }
              },
            })
            that.isDisabled = true
          } else {
            // tt.chooseAddress(); // 已授权，直接获取地址
          }
        },
        fail(res) {
          that.isDisabled = false
        },
      })
    },
  },
}
</script>

<style>
page {
  background-color: #f8f7f8;
}
</style>
<style lang="scss" scoped>
.page-title {
  width: 94%;
  margin: 0 auto;
  padding-top: 40rpx;
  font-size: 28rpx;
  color: rgba(69, 90, 100, 0.6);
}

.form-wrapper {
  // margin: 18rpx auto 20rpx -45px;
  margin-top: 30rpx;
  padding: 0 30rpx;
  width: 100%;
  box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
  border-radius: 16rpx;
  background: #fff;
}

// 底部操作栏
.footer {
  margin-top: 80rpx;

  .btn-wrapper {
    height: 100%;
    // display: flex;
    // align-items: center;
    padding: 0 20rpx;
  }

  .btn-item {
    flex: 1;
    font-size: 28rpx;
    height: 86rpx;
    color: #fff;
    border-radius: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-item-wechat {
    background: #0ba90b;
    margin-bottom: 26rpx;
  }

  .btn-item-main {
    background: linear-gradient(130.69deg, #0059ff 0%, #004ad4 100%);
    color: #fff;

    // 禁用按钮
    &.disabled {
      opacity: 0.6;
    }
  }
}
textarea {
  height: 150rpx;
  padding-top: 15rpx;
  line-height: 40rpx;
}
.flexTop ::v-deep  .tn-form-item--left {
  display: initial;
}
</style>
