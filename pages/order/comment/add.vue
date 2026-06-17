<template>
  <view class="oa-content" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 120rpx)' : '120rpx' }">
    <view class="e-1">
      <view class="e-4">您对本次服务还满意吗？</view>
      <view class="e-5">
        <view class="e-6">师傅技能</view>
        <tn-rate :size="40" :gutter="20" inactiveColor="#F5F7FC" inactiveIcon="star-fill" v-model="rate1" activeColor="#FF5722"></tn-rate>
      </view>
      <view class="e-5">
        <view class="e-6">服务态度</view>
        <tn-rate :size="40" :gutter="20" inactiveColor="#F5F7FC" inactiveIcon="star-fill" v-model="rate2" activeColor="#FF5722"></tn-rate>
      </view>
      <view class="e-5" style="margin-bottom: 16rpx">
        <view class="e-6">整体评价</view>
        <tn-rate :size="40" :gutter="20" inactiveColor="#F5F7FC" inactiveIcon="star-fill" v-model="rate3" activeColor="#FF5722"></tn-rate>
      </view>
    </view>
    <view class="e-2">
      <tn-input v-model="content" placeholder="这次服务体验有什么有缺点？说说的服务体验吧..." type="textarea" :height="200" :clearable="false" />
      <view class="e-3">
        <tn-image-upload :width="104" :height="104" :action="action" :fileList="fileList" @onSuccess="uploadSuccess" @onRemove="uploadRemove" @on-choose-complete="chooseComplete" @on-error="uploadError"></tn-image-upload>
      </view>
    </view>
    <tn-tips ref="tips" position="center"></tn-tips>
    <!-- 悬浮按钮-->
    <view class="tn-flex tn-footerfixed tn-padding" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 20rpx)' : '' }">
      <view class="tn-flex-1 justify-content-item tn-text-center">
        <tn-button class="tn-button" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="onSubmit">
          <text class="">提交评价</text>
        </tn-button>
      </view>
    </view>
    <tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import customerNotice from '@/components/customerNotice'
import { timestampToTime } from '@/util/util.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  components: {
    customerNotice,
  },
  data() {
    return {
      content: '',
      // 演示地址，请勿直接使用
      action: '',
      fileList: [],
      rate1: 5,
      rate2: 5,
      rate3: 5,

      workId: '',
      orderId: '',
      detail: '',
      images: [],
    }
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id
      this.getComment()
      this.getDetail()
    }
  },
  onShow() {
    // setTimeout(()=>{
    // 	this.showCountDown = true
    // })
    // console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
    this.action = this.$http.commoneUrl + 'app-api/infra/file/upload'
  },
  methods: {
    getDetail() {
      this.$http
        .getRequest('app-api/trade/order/get-detail', {
          id: this.orderId,
        })
        .then(res => {
          if (res.code == 0) {
            this.detail = res.data
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
    getComment() {
      this.$http
        .getRequest('app-api/trade/order-score/get/order', {
          id: this.orderId,
        })
        .then(res => {
          if (res.code == 0) {
            if (res.data) {
              this.rate1 = res.data.workTechnologyScore === null ? 5 : res.data.workTechnologyScore
              this.rate2 = res.data.workStandScore === null ? 5 : res.data.workStandScore
              this.rate3 = res.data.workWholeScore === null ? 5 : res.data.workWholeScore
              this.content = res.data.remark
              this.workId = res.data.workId
            }
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
    onSubmit() {
      if (this.content == '') {
        this.$refs.tips.show({
          msg: '评价不能为空',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      this.$http
        .postRequest('app-api/trade/order-score/create', {
          orderId: this.orderId.toString(),
          workId: this.workId,
          workScore: 5,
          workStandScore: this.rate2,
          workTechnologyScore: this.rate1,
          workWholeScore: this.rate3,
          remark: this.content,
        })
        .then(res => {
          if (res.code == 0) {
            this.$http
              .postRequest('app-api/trade/order/item/create-comment', {
                anonymous: false,
                orderItemId: this.detail.items[0].id,
                benefitScores: this.rate2,
                descriptionScores: this.rate1,
                content: this.content,
                images: this.images,
              })
              .then(res => {
                if (res.code == 0) {
                  this.$refs.toast.show({
                    title: '评价成功',
                    icon: 'success',
                    image: '',
                    duration: 1000,
                  })
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 1000)
                } else {
                  this.$refs.tips.show({
                    msg: res.msg,
                    backgroundColor: '#E83A30',
                    fontColor: '#FFFFFF',
                    duration: 1500,
                  })
                }
              })
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
    chooseComplete() {
      uni.showLoading({
        title: '上传中...',
      })
    },
    uploadSuccess(data, index, lists) {
      console.log('上传成功')
      uni.hideLoading()
      if (data.code == 0) {
        this.images[index] = data.data
      }
      // console.log(this.images)
    },
    uploadError() {
      uni.hideLoading()
      this.$refs.tips.show({
        msg: '上传失败',
        backgroundColor: '#E83A30',
        fontColor: '#FFFFFF',
        duration: 1500,
      })
    },
    uploadRemove(index, lists, name) {
      this.images.splice(index, 1)
      // console.log(this.images)
    },
  },
}
</script>

<style lang="scss" scoped>
.oa-content {
  width: 100%;
  height: 100vh;
  padding-top: 22rpx;
  overflow-y: scroll;
  background: $tn-smallLabel-bg-color;
  box-sizing: border-box;
}
/* 底部悬浮按钮 start*/
.tn-tabbar-height {
  min-height: 160rpx;
  height: calc(180rpx + env(safe-area-inset-bottom) / 2);
  height: calc(180rpx + constant(safe-area-inset-bottom));
}

.tn-footerfixed {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 1024;
  box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.2);
  background-color: white;
  gap: 20rpx;
  padding: 20rpx 30rpx;
}

::v-deep  .tn-button button {
  // background: linear-gradient(130.69deg, #0059ff 0%, #004ad4 100%);
  // // box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
  background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
}
::v-deep  .tn-icon-close-fill {
  font-size: 40rpx !important;
  color: $tn-font-title-color !important;
}
/* 底部悬浮按钮 end*/
::v-deep  .time-line-item__content__time {
  color: #a29e9e;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.e-1 {
  width: 694rpx;
  padding: 20rpx 24rpx;
  background-color: $tn-bg-color;
  margin: 0 auto;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
}
.e-2 {
  width: 694rpx;
  margin: 0 auto;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: $tn-bg-color;
  box-sizing: border-box;
}
.e-3 ::v-deep  .tn-image-upload__item {
  background-color: transparent !important;
  border-radius: 16rpx;
  border: 1rpx dashed #7a8499;
}

::v-deep  .tn-image-upload__item-add__tips {
  margin-top: 0 !important;
  font-size: 20rpx;
}
.e-4 {
  font-size: 28rpx;
  font-weight: 600;
  color: $tn-font-title-color;

  font-weight: bold;
  color: $tn-font-title-color;
}
.e-5 {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}
.e-6 {
  margin-right: 30rpx;
  font-size: 24rpx;
  color: $my-font-sub-color;
}
</style>
