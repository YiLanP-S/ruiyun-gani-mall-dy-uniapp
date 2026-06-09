<template>
  <view class="applyForm">
    <!-- <view class="pageBg">
      <view class="pageBg_t"></view>
      <view class="pageBg_c">
        <view class="title">每个城市限 1-3 个合作名额，先到先得，招满即停！</view>
      </view>
    </view> -->
    <view class="content">
      <view class="item">
        <view class="item_l">姓名</view>
        <view class="item_r">
          <tn-input v-model="form.name" placeholder="请输入您的姓名" />
        </view>
      </view>
      <view class="item">
        <view class="item_l">城市</view>
        <view class="item_r item_r_act">
          <view class="item_rl"><tn-input v-model="form.areaName" placeholder="请选择您想申请的城市" disabled @click="show = true" /></view>
          <view class="item_rr" @click="show = true">
            <text class="tn-icon-down"></text>
          </view>
        </view>
      </view>
      <view class="item">
        <view class="item_l">手机</view>
        <view class="item_r"><tn-input v-model="form.mobile" placeholder="请输入您的手机号码" /></view>
      </view>
    </view>
    <view class="btnBox">
      <view class="btnBox_t">招商经理30分钟内联系你</view>
      <view class="btnBox_c" @click="addPartner">一键提交</view>
    </view>
    <tn-tips ref="tips" position="center"></tn-tips>
    <tn-picker-new mode="region" v-model="show" @confirm="selectArea"></tn-picker-new>
  </view>
</template>

<script>
import { addPartnerAPI } from '@/api/brief/brief.js'
// import customerNotice from "@/components/customerNotice";
export default {
  data() {
    return {
      show: false,
      actionSheetList: [
        {
          text: '男',
        },
        {
          text: '女',
        },
        {
          text: '保密',
        },
      ],
      form: {
        name: null,
        mobile: null,
        province: null,
        city: null,
        area: null,
        areaName: null,
      },
    }
  },
  methods: {
    // 点击确定
    selectArea(e) {
      console.log(e, e.province.label + ' ' + e.city.label + ' ' + e.area.label)
      this.form.areaName = e.province.label + ' ' + e.city.label + ' ' + e.area.label
      this.form.province = e.province.label
      this.form.city = e.city.label
      this.form.area = e.area.label
    },

    async addPartner() {
      if (!this.form.name) {
        this.$refs.tips.show({
          msg: '请输入您的姓名',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return false
      }
      if (!this.form.areaName) {
        this.$refs.tips.show({
          msg: '请选择城市',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return false
      }

      if (!this.form.mobile) {
        this.$refs.tips.show({
          msg: '请输入您的手机号',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return false
      }
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.form.mobile)) {
        this.$refs.tips.show({
          msg: '请输入正确的手机号',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return false
      }
      let obj = {
        name: this.form.name,
        phone: this.form.mobile,
        province: this.form.province,
        city: this.form.city,
        district: this.form.area,
      }
      console.log('obj', obj)

      let res = await addPartnerAPI(obj)
      console.log('res', res)
      if (res.code == 0) {
        this.$refs.tips.show({
          msg: '提交成功',
          backgroundColor: '#0059ff',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/index/index',
          })
        }, 1500)
      } else {
        this.$refs.tips.show({
          msg: '提交失败',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.applyForm {
  width: 100%;
  height: 100vh;
  // background: linear-gradient(180deg, rgba(0, 89, 255, 1) 0%, rgba(241, 246, 255, 1) 100%);
  background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf012.png) no-repeat;
  background-size: cover;
  position: relative;
  // padding-top: 836rpx;
  box-sizing: border-box;
  // .pageBg {
  //   position: absolute;
  //   width: 100%;
  //   height: 890rpx;
  //   padding-top: 62rpx;
  //   box-sizing: border-box;
  //   .pageBg_t {
  //     width: 546rpx;
  //     height: 152rpx;
  //     background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf007x.png) no-repeat;
  //     background-size: 546rpx 152rpx;
  //     margin: 0 auto;
  //     margin-bottom: 48rpx;
  //     box-sizing: border-box;
  //   }
  //   .pageBg_c {
  //     //   width: 546rpx;
  //     // height: 152rpx;
  //     width: 750rpx;
  //     height: 628rpx;
  //     background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf008.png) no-repeat;
  //     background-size: 100% 100%;
  //     margin: 0 auto;
  //     box-sizing: border-box;
  //     position: relative;
  //     .title {
  //       width: 602rpx;
  //       height: 62rpx;
  //       border-radius: 31rpx;
  //       background-color: #fff;
  //       position: absolute;
  //       top: 32rpx;
  //       left: 50%;
  //       transform: translateX(-50%);
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       font-size: 24rpx;
  //       line-height: 16.8px;
  //       color: #0059ff;
  //     }
  //   }
  // }
  .content {
    width: 694rpx;
    height: 354rpx;
    background-color: #fff;
    position: absolute;
    bottom: 258rpx;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 24rpx;
    padding-top: 42rpx;
    overflow: hidden;
    box-sizing: border-box;
    .item {
      width: 100%;
      height: 56rpx;
      display: flex;
      &:nth-child(1) {
        margin-bottom: 14rpx;
      }
      &:nth-child(2) {
        height: 104rpx;
        padding: 28rpx 0;
        border-top: 2rpx solid rgba(245, 246, 250, 1);
        border-bottom: 2rpx solid rgba(245, 246, 250, 1);
        margin-bottom: 24rpx;
        box-sizing: border-box;
      }

      .item_l {
        width: 126rpx;
        border-right: 2rpx solid rgba(245, 246, 250, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .item_r {
        flex: 1;
        padding-left: 44rpx;
        box-sizing: border-box;
        display: flex;
        // justify-content: center;
        align-items: center;
        .tn-input {
          font-size: 32rpx;
        }
      }
      .item_r_act {
        width: 100%;
        height: 52rpx;
        display: flex;
        .item_rl {
          flex: 1;
        }
        .item_rr {
          width: 76rpx;
          height: 56rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-left: 2rpx solid rgba(245, 246, 250, 1);
        }
      }
    }
  }
  .btnBox {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    .btnBox_t {
      width: 100%;
      text-align: center;
      font-size: 24rpx;
      color: #7a8499;
      margin-bottom: 20rpx;
    }
    .btnBox_c {
      width: 694rpx;
      height: 96rpx;
      background: #0059ff;
      border-radius: 48rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      color: #fff;
      margin: 0 auto;
      margin-bottom: 42rpx;
    }
  }
}
</style>
