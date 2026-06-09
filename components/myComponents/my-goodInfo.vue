<template>
  <view class="a-14">
    <view class="a-15" v-for="(item, index) in list" :key="index" @click="tn('/pages/goods/detail?id=' + item.id)">
      <view class="item">
        <view class="item_l">
          <image v-if="item.picUrl" :src="item.picUrl" mode="aspectFit|aspectFill|widthFix" lazy-load="true" />
          <image v-else src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0022.png" mode="aspectFit|aspectFill|widthFix" lazy-load="true" />
        </view>
        <view class="item_r">
          <view class="item_rt">{{ item.name }}</view>
          <view class="item_tips">全国通用 | 随时退 | 一口价</view>
          <view class="item_rb">
            <view class="item_rbl">
              <text class="item_bll">￥</text> <text class="item_blc">{{ item.price ? $base.f2y(item.price) : '--' }}</text></view
            >
            <view class="item_rbr">立即下单</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  methods: {
    tn(e) {
      uni.navigateTo({
        url: e,
        fail() {
          uni.switchTab({
            url: e,
          })
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.a-14 {
  padding: 18rpx;
  padding-bottom: 1rpx;
  box-sizing: border-box;
}

.a-15 {
  width: 718rpx;
  height: 264rpx;
  position: relative;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  // margin-right: 16rpx;
  background-color: #fff;
  overflow: hidden;

  &:last-child {
    margin-bottom: 50rpx;
  }

  .item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 16rpx;
    box-sizing: border-box;
    .item_l {
      width: 234rpx;
      height: 234rpx;
      border-radius: 8rpx;
      overflow: hidden;
      image {
        display: inline-block;
        width: 234rpx;
        height: 234rpx;
      }
    }
    .item_r {
      flex: 1;
      height: 100%;
      margin-left: 16rpx;
      .item_rt {
        width: 100%;
        // min-height: 80rpx;
        font-size: 28rpx;
        font-weight: 600;
        // color: #4D4D4D;
        color: $tn-font-title-color;
        // text-indent: 1.5em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        margin-bottom: 20rpx;
      }
      .item_tips {
        font-size: 24rpx;
        font-weight: 500;
        letter-spacing: 0rpx;
        color: $my-font-sub-color;
        margin-bottom: 34rpx;
      }
      .item_rb {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .item_rbl {
          height: 36rpx;
          display: flex;
          align-items: baseline;
          .item_bll {
            height: 24rpx;
            font-size: 24rpx;
            font-weight: 500;
            letter-spacing: 0rpx;
            color: $tn-dot-color;
            // padding-top: 12rpx;
            box-sizing: border-box;
            // background-color: #999;
          }
          .item_blc {
            height: 36rpx;
            font-size: 36rpx;
            font-weight: 700;
            letter-spacing: 0rpx;
            color: $tn-dot-color;
            margin: 0 4rpx 0 2rpx;
            // background-color: pink;
          }
        }
        .item_rbr {
          // width: 196rpx;
          // height: 64rpx;
          padding: 15rpx 24rpx;
          opacity: 1;
          border-radius: 32rpx;
          background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24rpx;
          font-weight: 500;
          color: $tn-bg-color;
        }
      }
    }
  }
}

.text {
  margin-top: 10rpx;
  /* 文本与滑块轨道的间距 */
  color: #333;
  font-size: 28rpx;
}
</style>
