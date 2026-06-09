<template>
  <view class="oa-content" :class="vuex_is_black_stripe ? 'content_act' : 'oa-content_act2'">
    <view class="tn-padding-bottom-xl">
      <view class="content-box">
        <view class="n-4" v-for="(v, i) in orderList" :key="i">
          <view class="n-5">
            <image class="n-6" :src="v.itemPicUrl"></image>
            <view class="n-7">
              <view class="n-8">{{ v.itemName }}</view>
              <view class="n-9">{{ v.itemSize }}</view>
            </view>
          </view>
          <view class="n-10">
            <view class="n-11">施工前照片</view>
            <view click="n-12">
              <block v-for="(item, index) in v.images.slice(0, 3)" :key="index">
                <image class="n-13" v-if="item.imgUrl" :src="item.imgUrl" @click="previewImages(item.imgUrl, v.images.slice(0, 3))"></image>
              </block>
            </view>
          </view>
          <view class="n-10">
            <view class="n-11">施工中照片</view>
            <view click="n-12">
              <block v-for="(item, index) in v.images.slice(3, 6)" :key="index">
                <image class="n-13" v-if="item.imgUrl" :src="item.imgUrl" @click="previewImages(item.imgUrl, v.images.slice(3, 6))"></image>
              </block>
            </view>
          </view>
          <view class="n-10">
            <view class="n-11">施工后照片</view>
            <view click="n-12">
              <block v-for="(item, index) in v.images.slice(6, 10)" :key="index">
                <image class="n-13" v-if="item.imgUrl" :src="item.imgUrl" @click="previewImages(item.imgUrl, v.images.slice(6, 10))"></image>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>
    <tn-tips ref="tips" position="center"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
export default {
  name: 'TemplateIntegral',
  mixins: [template_page_mixin],
  data() {
    return {
      id: '',
      orderList: [],
    }
  },
  onLoad(options) {
    console.log('options', options)
    if (options.id) {
      this.id = options.id
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      this.$http
        .getRequest('app-api/trade/work/get-work-construct-img', {
          orderId: this.id,
        })
        .then(res => {
          if (res.code == 0) {
            this.orderList = res.data ? res.data : []
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
    previewImages(url, urls) {
      let urlsNew = []
      urls.forEach((item, index) => {
        if (item.imgUrl) {
          urlsNew.push(item.imgUrl)
        }
      })
      uni.previewImage({
        current: url, // 当前显示图片的http链接
        urls: urlsNew, // 需要预览的图片http链接列表
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.oa-content {
  background-color: $tn-bg1-color;
  min-height: 100vh;
  padding-bottom: 60rpx;
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
  padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
  padding-bottom: 120rpx;
}
.oa-content_act {
  padding-bottom: 40rpx;
}
.oa-content_act2 {
  padding-bottom: 0rpx;
}
.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.content-box {
  padding: 30rpx;
}
.n-4 {
  background-color: white;
  margin-bottom: 30rpx;
  border-radius: 8rpx;
  padding: 20rpx;
}
.n-5 {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $tn-border-solids-color;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}
.n-6 {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
}
.n-7 {
  margin-left: 20rpx;
}
.n-8 {
  font-size: 30rpx;
  font-weight: bold;
}
.n-9 {
  color: $tn-font-sub1-color;
  font-size: 24rpx;
  margin-top: 20rpx;
}
.n-10 {
  // margin-bottom: 10rpx;
}
.n-11 {
  font-size: 30rpx;
  position: relative;
  padding-left: 20rpx;
}
.n-11:before {
  position: absolute;
  display: block;
  content: '';
  height: 30rpx;
  border-left: 5rpx solid $tn-theme-color;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.n-13 {
  width: 217rpx;
  height: 217rpx;
  padding: 20rpx;
}
</style>
