<template>
  <view class="search_box" @click="go2searchPage">
    <view class="search_box_c">
      <view class="search_box_cl">
        <image src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0020.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
        小灶神灶台保护膜
      </view>
      <view class="search_box_cr">搜索</view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    go2searchPage() {
      console.log('go2searchPage')
      uni.navigateTo({
        url: '/pages/goods/search',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
//搜索
.search_box {
  width: 100%;
  height: 112rpx;
  position: fixed;
  top: 0;
  left: 0;
  background-color: $tn-bg-color;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  .search_box_c {
    width: 694rpx;
    height: 72rpx;
    background: $tn-smallLabel-bg-color;
    border-radius: 36rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search_box_cl {
      padding-left: 42rpx;
      font-size: 28rpx;
      color: $my-font-sub-color;
      display: flex;
      align-items: center;
      image {
        display: inline-block;
        width: 32rpx;
        height: 39rpx;
        margin-right: 16rpx;
      }
    }
    .search_box_cr {
      width: 122rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
      font-size: 28rpx;
      color: $tn-bg-color;
      border-radius: 30rpx;
      margin-right: 6rpx;
    }
  }
}
</style>
