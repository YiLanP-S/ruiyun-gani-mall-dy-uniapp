<template>
  <view class="oa-content">
    <!-- 		<view class="a-0" :style="{height: vuex_custom_bar_height + 'px'}">
			<image src="/static/top_bg.png" style="width: 100%;height: 100%;"></image>
			<tn-nav-bar :isBack="false" backgroundColor="transparent" :backTitle="backTitle">
				我的
			</tn-nav-bar>
      https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/userLogo.png
		</view> -->
    <view class="tn-padding-bottom-xl">
      <view class="h-1">
        <view class="h-2">
          <view class="h-3" @click="isLogin ? '' : login()">
            <image class="h-4" :src="isLogin ? userData.avatar : 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0019.png'"></image>
            <view class="h-5">
              <view class="h-6-box">
                <view class="h-6" :class="!isLogin ? 'h-6_act' : ''">{{ isLogin ? (userData.nickname ? userData.nickname : '抖音用户') : '一键登录' }}</view>

                <text v-if="isLogin" class="tn-icon-edit" style="margin-left: 20rpx; font-size: 35rpx; color: #7a8499; margin-top: 2rpx" @click="isLogin ? tn('../uesr/set') : login()"></text>
              </view>
              <view class="h-7">{{ isLogin ? userData.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '点击登录，享受完整服务' }}</view>
            </view>
          </view>
        </view>

        <view class="content">
          <!-- 我的订单 -->
          <!-- <view class="h-8" style="margin-top: 30rpx">
            <view class="h-9">
              <view class="h-10">我的订单</view>
              <view class="h-11" @click="isLogin ? tn('../order/serviceList') : login()">
                查看全部
                <text class="tn-icon-right"></text>
              </view>
            </view>
            <view class="h-12">
              <view class="h-13" v-for="(item, index) in smStatus" :key="index" @click="isLogin ? tn(item.text != '退款/售后' ? '/pages/orderList/index?status=' + item.status : '/pages/order/afterSales/list') : login()">
                <view class="h-14">
                  <image class="h-15" :src="item.icon"></image>
                  <tn-badge backgroundColor="#FF5722" :absolute="true" fontColor="#ffffff" right="15" v-if="item.num > 0">{{ item.num }}</tn-badge>
                </view>
                <view class="h-16">{{ item.text }}</view>
              </view>
            </view>
          </view> -->
          <!-- <view class="h-8 h1-8">
            <view class="h-9">
              <view class="h-10">常用服务</view>
            </view>
            <view class="h-12 h1-12">
              <view class="h-13" v-for="(item, index) in serverTypes" :key="index" @click="isLogin ? tn(item.url) : login()">
                <view class="h-14">
                  <image class="h-15" :src="item.icon"></image>
                  <tn-badge backgroundColor="#FF5722" :absolute="true" fontColor="#ffffff" right="15" v-if="item.num > 0">{{ item.num }}</tn-badge>
                </view>
                <view class="h-16">{{ item.text }}</view>
              </view>
            </view>
          </view> -->
          <!-- 常用服务 -->
          <view class="CommonServices">
            <!-- <view class="server_t">常用服务</view> -->
            <view class="server_c">
              <block v-for="(item, index) in serverTypes" :key="index">
                <button class="kfBtn" open-type="lifeIm" style="border-radius: 0; padding: 0" v-if="item.text === '在线客服'">
                  <view class="server_ci">
                    <view class="server_cil">
                      <image class="server_ico" :src="item.icon"></image>
                      <view class="server_title">{{ item.text }}</view>
                    </view>
                    <view class="server_cir">
                      <view class="server_times">{{ item.times }}</view>
                      <image class="server_zjt" src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0002.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
                    </view>
                  </view>
                </button>
                <view class="server_ci" v-else @click="clickBox(item)">
                  <view class="server_cil">
                    <image class="server_ico" :src="item.icon"></image>
                    <view class="server_title">{{ item.text }}</view>
                  </view>
                  <view class="server_cir">
                    <view class="server_times">{{ item.times }}</view>
                    <image class="server_zjt" src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0002.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
                  </view>
                </view>
              </block>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isLogin" class="f-36 f-36_act" @click="exit"> 退出登录 </view>
    <view v-else class="f-36 f-36_act2" @click="login"> 立即登录 </view>
    <tn-modal v-model="exitInfo.show" :title="exitInfo.title" :content="exitInfo.content" :button="exitInfo.button" @click="clickExit"></tn-modal>
    <tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
    <tn-tabbar v-model="currentIndex" :list="tabbarList" activeColor="#0059FF" inactiveColor="#AAAAAA" activeIconColor="#0059FF" :animation="true" :safeAreaInsetBottom="true" @change="switchTabbar"></tn-tabbar>
    <tuniaoui-wx-user-info v-model="loginShow" @updated="updatedUserInfoEvent"></tuniaoui-wx-user-info>
  </view>
</template>

<script>
import store from '../../store/index.js'
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import tuniaouiWxUserInfo from '@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue'
export default {
  components: { tuniaouiWxUserInfo },
  mixins: [template_page_mixin],
  name: 'Mine',
  data() {
    return {
      userData: {
        nickname: '',
        avatar: '',
        mobile: '',
      },
      telephone: null,
      count: 5,
      smStatus: [
        // { text: '代付款', num: 0, icon: '/static/user/finish_icon.png', status: 30 },
        { text: '代付款', num: 0, icon: '/static/user/djq_icon.png', status: 30 },
        { text: '待预约', num: 0, icon: '/static/user/dyy_icon.png', status: 21 },
        { text: '待服务', num: 0, icon: '/static/user/dfw_icon.png', status: 22 },
        { text: '待结算', num: 0, icon: '/static/user/djq_icon.png', status: 28 },
        { text: '退款/售后', num: 0, icon: '/static/user/afterSales_icon.png', status: '' },
      ],
      mcStatus: [
        { text: '待付款', num: 0, icon: '/static/user/dfk_icon.png' },
        { text: '待发货', num: 0, icon: '/static/user/dfh_icon.png' },
        { text: '待配送', num: 20, icon: '/static/user/dps_icon.png' },
        { text: '待收货', num: 0, icon: '/static/user/dsh_icon.png' },
        { text: '待评价', num: 0, icon: '/static/user/dpj_icon.png' },
      ],
      serverTypes: [
        { text: '地址管理', num: 0, icon: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0008.png', url: '/pages/uesr/address/addresslist' },
        // {text:'客服中心',num:0,icon:'/static/user/kfzx_icon.png'},
        // {text:'企业合作',num:20,icon:'/static/user/qyhz_icon.png'},
        // {text:'产品防伪',num:0,icon:'/static/user/cpfw_icon.png'},
        // {text:'专属师傅',num:0,icon:'/static/user/zssf_icon.png'},
        // {text:'发票申请',num:0,icon:'/static/user/fpsq_icon.png'},
        { text: '授权服务商', num: 0, icon: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0007.png', url: '/pages/serviceProviders/index' },
        { text: '服务资质', num: 0, icon: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0006.png', url: '/pages/serviceQualification/index' },
        { text: '在线客服', num: 0, icon: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0010.png', url: '', times: '8:00 ~ 21:00' },
        { text: '电话质询', num: 0, icon: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0005.png', url: '', times: '8:00 ~ 21:00' },
        // {text:'关于我们',num:0,icon:'/static/user/gywm_icon.png'},
      ],
      distributionServices: [
        { text: '分销码', num: 0, icon: '/static/user/fx_code.png', url: '/pages/uesr/invite' },
        { text: '分销用户', num: 0, icon: '/static/user/fxyh_icon.png', url: '/pages/order/distributionUsers' },
        { text: '分销订单', num: 0, icon: '/static/user/fpsq_icon.png', url: '/pages/order/distributionList' },
      ],
      isLogin: false,
      dataStatistics: {
        brokeragePrice: 0,
        onsite: 0,
        salePrice: 0,
        score: 0,
        total: 0,
        unConstruct: 0,
        unVerify: 0,
        userNum: 0,
      },
      exitInfo: {
        show: false,
        title: '提示',
        content: '是否退出？',
        button: [
          {
            text: '取消',
            backgroundColor: '#E6E6E6',
            fontColor: '#FFFFFF',
            shape: 'round',
          },
          {
            text: '确定',
            backgroundColor: '#0059FF',
            fontColor: '#FFFFFF',
          },
        ],
      },
      phone: '',
      // tabbar当前被选中的序号
      currentIndex: 2,
      dataStatistics: {
        brokeragePrice: 0,
        onsite: 0,
        salePrice: 0,
        score: 0,
        total: 0,
        unConstruct: 0,
        unVerify: 0,
        userNum: 0,
        outBrokerage: 0,
      },
      syInfo: {
        allBrokerage: 0,
        outBrokerage: 0,
        productSaleBrokerage: 0,
        workBrokerage: 0,
      },
    }
  },
  watch: {
    loginShow: {
      handler(newValue, oldValue) {
        console.log('loginShow changed:', newValue, oldValue)
        if (!newValue) {
          this.getuser()
          this.isLogin = uni.getStorageSync('token') ? true : false
        }
      },
      deep: true, // 开启深度监听以检测数组内部项的变化
    },
  },
  onShow() {
    this.currentIndex = 2
    this.isLogin = uni.getStorageSync('token') ? true : false
    this.getuser()
  },
  onLoad(options) {
    console.log(options)
    console.log(options.scene)
    console.log(decodeURIComponent(options.scene).split('=')[1])
    if (options.scene) {
      store.commit('$tStore', {
        name: 'distribution_code',
        value: decodeURIComponent(options.scene).split('=')[1],
      })
    }
    // this.getuser();
  },
  methods: {
    getuser() {
      this.$http.getRequest('app-api/member/user/get').then(res => {
        if (res.code == 0) {
          this.userData = res.data
          this.getWorkerStatistics()
        } else if (res.code == 401) {
          this.isLogin = false
          return
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
    getSy() {
      let that = this
      that.$http.getRequest('app-api/trade/brokerage-record/getAllBrokerage').then(res => {
        if (res.code == 0) {
          this.syInfo = res.data
        } else {
          that.$refs.tips.show({
            msg: res.msg,
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 1500,
          })
        }
      })
    },
    getWorkerStatistics() {
      this.$http.getRequest('app-api/trade/worker-statistics/get').then(res => {
        if (res.code == 0) {
          this.dataStatistics = res.data
          this.getSy()
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
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
    // 提示
    toast() {
      this.$refs.toast.show({
        title: '功能暂未开放，敬请期待~',
        icon: 'time',
        image: '',
        duration: 1500,
      })
    },
    switchTabbar(e, pagePath) {
      console.log('e', e)
      this.currentIndex = e
      uni.switchTab({
        url: pagePath,
      })
    },
    login() {
      store.commit('$tStore', {
        name: 'loginShow',
        value: true,
      })
    },
    // 获取到的用户信息
    updatedUserInfoEvent(info) {
      console.log('获取到的用户信息', info)
      let that = this
      that.$http.putNewRequest('app-api/member/user/update', info).then(res => {
        if (res.code == 0) {
          that.loginShow = false
          that.isLogin = true
          that.getuser()
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
    exit() {
      this.exitInfo.show = true
    },
    clickExit(e) {
      if (e.index == 0) {
        this.exitInfo.show = false
      }
      if (e.index == 1) {
        this.exitInfo.show = false
        uni.removeStorageSync('token')
        this.isLogin = false
        this.$refs.toast.show({
          title: '退出成功',
          icon: 'success',
          image: '',
          duration: 1000,
        })
      }
    },
    clickBox(v) {
      if (this.isLogin) {
        if (v.text === '电话质询') {
          uni.makePhoneCall({
            phoneNumber: '15527044531',
          })
        } else {
          this.tn(v.url)
        }
      } else {
        this.login()
      }
      // isLogin ? tn(item.url) : login()
    },
  },
}
</script>

<style lang="scss" scoped>
.wu {
  margin-top: 25vh;
}

/* 胶囊*/
.tn-custom-nav-bar__back {
  width: 60%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 1000rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  color: #ffffff;
  font-size: 18px;

  .icon {
    display: block;
    flex: 1;
    margin: auto;
    text-align: center;
  }
}

/* 新增OA色系，自行调用，或者拿色值去用，多种方式*/
.oa-black {
  color: #1d2541;
  background-color: #1d2541;
}

.oa-blue {
  color: #4b98fe;
  background-color: #4b98fe;
}

.oa-orangeyellow {
  color: #ffac00;
  background-color: #ffac00;
}

.oa-green {
  color: #00d05e;
  background-color: #00d05e;
}

.oa-orange {
  color: #fe871b;
  background-color: #fe871b;
}

.oa-cyan {
  color: #00c8b0;
  background-color: #00c8b0;
}

.oa-indigo {
  color: #00b9fe;
  background-color: #00b9fe;
}

.oa-orangered {
  color: #fb6a67;
  background-color: #fb6a67;
}

.oa-purple {
  color: #957bfe;
  background-color: #957bfe;
}

.oa-dark {
  color: #aaaaaa;
  background-color: #e6e6e6;
}

.oa-content {
  background-color: $tn-bg-color;
  min-height: 100vh;
  padding-bottom: 60rpx;
  padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
  padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
  padding-bottom: 120rpx;
}

.top-fixed {
  position: fixed;
  background-color: rgba(255, 255, 255, 1);
  top: 0;
  width: 100%;
  transition: all 0.25s ease-out;
  z-index: 100;
  box-sizing: border-box;
  padding: 0 20rpx;
}

/* 文字截取*/
.clamp-text-1 {
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}

.clamp-text-2 {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* 背景阴影 start*/
.content-bg {
  border-radius: 15rpx;
  background-color: #ffffff;
  margin-top: 30rpx;
}

/* 用户头像 start */
.user-image {
  width: 35rpx;
  height: 35rpx;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

.user-pic {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
  box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  overflow: hidden;
}

/* 标签 start*/
.tag-state {
  display: inline-block;
  padding: 8rpx 12rpx 6rpx;
  margin: 12rpx 15rpx 15rpx 10rpx;
  border-radius: 10rpx;
}

.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: white;
}

.f-12 {
  display: flex;
  margin-top: 30rpx;
}

.f-13 {
  flex: 1;
  text-align: center;
  position: relative;
}

.f-13::after {
  display: block;
  content: '';
  height: 44rpx;
  border-left: 1px solid #cacaca;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}

.f-12 .f-13:last-child::after {
  border-left: none;
}

.f-14 {
  color: #00091a;
  font-size: 32rpx;
  font-weight: 700;
}

.f-15 {
  color: $tn-middle-color;
  font-size: 24rpx;
  margin-top: 5rpx;
}

.h-1 {
  width: 100%;
  position: relative;
  padding-top: 32rpx;
}

.h-2 {
  width: 694rpx;
  height: 432rpx;
  padding-top: 78rpx;
  margin: 0 auto;
  background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0018.png) no-repeat;
  background-size: 694rpx 172rpx;
  box-sizing: border-box;
}

.h-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.h-4 {
  width: 168rpx;
  height: 168rpx;
  border-radius: 100%;
}

.h-6-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16rpx;
}

.h-6 {
  font-size: 40rpx;
  color: $tn-font-title-color;
  font-weight: 700;
}

.h-6_act {
  color: $tn-theme-color;
}

.h1-6 {
  background-color: $tn-theme-color;
  color: white;
  display: flex;
  align-items: center;
  border-radius: 30rpx;
  padding: 5rpx 20rpx;
  margin-left: 20rpx;
  font-size: 40rpx;
}

.h2-6 {
  width: 42rpx;
  height: auto;
}

.h3-6 {
  margin-left: 10rpx;
}

.h-7 {
  font-size: 24rpx;
  color: $my-font-sub-color;
  margin-top: 10rpx;
  opacity: 0.75;
  display: flex;
  justify-content: center;
}

.h-8 {
  padding: 22rpx 28rpx 32rpx;
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 24rpx;
  box-shadow: 0rpx -4rpx 8rpx #a9a4a4, 0rpx 4rpx 8rpx #a9a4a4;
}

.h1-8 {
  padding: 20rpx 20rpx 0 20rpx;
}

.h-9 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.h-10 {
  font-size: 30rpx;
  color: $tn-font-title-color;
  font-weight: bold;
}

.h-11 {
  color: $tn-font-sub1-color;
  display: flex;
  align-items: center;
  font-size: 26rpx;
}

.h-11 text {
  margin-left: 10rpx;
}

.h-12 {
  display: flex;
  flex-wrap: wrap;
  margin-top: 40rpx;
}

.h-13 {
  text-align: center;
  width: 20%;
}

.h1-12 .h-13 {
  margin-bottom: 30rpx;
}

.h-14 {
  position: relative;
}

// .h-12 .h-13:nth-child(5n){
// 	margin-right: 0;
// }
.h-15 {
  width: 56rpx;
  height: 56rpx;
}

.h-16 {
  margin-top: 5rpx;
  font-size: 26rpx;
}

.f-16 {
  height: 220rpx;
  border-radius: 8rpx;
  overflow: hidden;
  position: relative;
  margin-top: 30rpx;
  padding: 0 20rpx;
}

.f-17 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.f-18 {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 1;
  padding-top: 30rpx;
}

.f-19 {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
}

.f-20 {
  font-size: 64rpx;
  color: white;
  font-weight: 700;
}

.f-21 {
  width: 188rpx;
  height: 72rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: white;
}

.f-40 {
  position: relative;
  z-index: 1;
  display: flex;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15rpx;
}

.f-41 {
  padding: 0 20rpx;
  border-left: 1rpx solid rgba(255, 255, 255, 0.5);
  height: 25rpx;
  line-height: 25rpx;
}

.f-40 .f-41:first-child {
  padding-left: 0;
  border-left: none;
}

.f-42 {
  color: white;
  font-weight: bold;
  margin-left: 10rpx;
}

.f-43 {
  width: 80rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  color: white;
  background-color: $tn-theme-color;
  font-size: 26rpx;
}

.f-44 {
  font-size: 24rpx;
  color: $tn-font-sub1-color;
  margin-top: 20rpx;
  background-color: white;
  padding: 20rpx;
  border-radius: 8rpx;
}

.f-45 {
  width: 218rpx;
  height: 72rpx;
  background-color: $tn-theme-color;
  padding-left: 10rpx;
  border-top-left-radius: 100rpx;
  border-bottom-left-radius: 100rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-right: -30rpx;
}

.f-46 {
  background-color: white;
  width: 40rpx;
  height: 40rpx;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.f-47 {
  color: $tn-theme-color;
}

.f-48 {
  font-size: 30rpx;
  color: white;
  margin-left: 35rpx;
}

.f-36 {
  position: fixed;
  bottom: 200rpx;
  left: 28rpx;
  width: 694rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 78rpx;
  font-size: 28rpx;
  border-radius: 40rpx;
}
.f-36_act {
  background-color: #fff;
  color: $my-font-sub-color;
  border: 2rpx solid #e0e0e0;
}
.f-36_act2 {
  color: #fff;
  background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
}

.content {
  width: 694rpx;
  margin: 0 auto;
  // position: absolute;
  // top: 238rpx;
  // left: 50%;
  // transform: translateX(-50%);
}

//常用服务
.CommonServices {
  width: 100%;
  background-color: $tn-smallLabel-bg-color;
  border-radius: 16rpx;
  // box-shadow: 0rpx -4rpx 8rpx #a9a4a4, 0rpx 4rpx 8rpx #a9a4a4;
  .server_t {
    width: 100%;
    height: 88rpx;
    font-size: 28rpx;
    font-weight: 600;
    color: $tn-font-title-color;
    border-radius: 16rpx;
    padding: 22rpx 28rpx;
    box-sizing: border-box;
  }
  .server_c {
    width: 100%;
    padding: 0 26rpx;
    box-sizing: border-box;
    .server_ci {
      width: 100%;
      height: 88rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #f7f7f7;
      box-sizing: border-box;
      &:first-child {
        padding-top: 12rpx;
        box-sizing: border-box;
      }
      &:last-child {
        border-bottom: none;
      }
      .server_cil {
        display: flex;
        align-items: center;
        .server_ico {
          width: 48rpx;
          height: 48rpx;
          margin-right: 22rpx;
        }
        .server_title {
          font-size: 28rpx;
          font-weight: 500;
          letter-spacing: -0.6rpx;
          color: $my-font-title-color;
        }
      }
      .server_cir {
        display: flex;
        align-items: center;
        .server_times {
          font-size: 24rpx;
          font-weight: 500;
          letter-spacing: -0.6rpx;
          color: $tn-font-title-color;
          margin-right: 18rpx;
        }
        .server_zjt {
          width: 10rpx;
          height: 20rpx;
        }
      }
    }
    .kfBtn {
      background: $tn-smallLabel-bg-color;
    }
  }
}
</style>
