<template>
  <view class="oa-content">
    <view class="j-1">
      <tn-tabs :list="types" :isScroll="true" :current="current" name="name" @change="change" inactiveColor="#7A8499" activeColor="#0059FF"></tn-tabs>
    </view>
    <view class="tn-padding-bottom-xl listBox" :style="{ paddingBottom: contentPaddingBottom + 'rpx' }">
      <view class="j-2">
        <view class="j-3" v-for="(item, index) in list" :key="index">
          <view class="j-4" @click="go2Detail(item.id)">
            <view class="j-5">订单号：{{ item.no }}</view>
            <view class="j-6">{{ formatOrderStatus(item) }}</view>
          </view>
          <view class="c-15-box" @click="go2Detail(item.id)">
            <view class="c-15" v-for="item1 in item.items" :key="item1.id">
              <view class="imgBox">
                <image v-if="item1.picUrl" :src="item1.picUrl" lazy-load="true" />
                <image v-else src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0022.png" mode="aspectFit|aspectFill|widthFix" lazy-load="true" />
              </view>

              <view class="c-17">
                <view class="c-18">{{ item1.spuName }}</view>
                <view class="explanation">全国通用 | 随时退 | 一口价</view>
                <view class="c-19-box">
                  <view class="c-19" v-for="(item2, index2) in item1.properties" :key="index2">{{ item2.propertyName + ':' + item2.valueName }}<text>/</text></view>
                </view>
                <view class="c-20">
                  <view class="c-20_l">x1</view>
                  <!-- <view class="c-21"
                    ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item1.price / 100).toFixed(2)) }}</text></view
                  > -->
                  <view class="c-21"
                    ><text class="c-23">￥</text><text class="c-24">{{ $base.f2y(item.payPrice) }}</text></view
                  >
                </view>
              </view>
            </view>
          </view>
          <!-- <view class="j-7-box" @click="go2Detail(item.id)">
            <view class="j-7">
              <view class="j-8">定金:</view>
              <view class="j-9">￥{{ parseFloat((item.payPrice / 100).toFixed(2)) }}</view>
            </view>
            <view class="j-7">
              <view class="j-8">需付余款:</view>
              <view class="j-9">￥{{ parseFloat((item.finishPayPrice / 100).toFixed(2)) }}</view>
            </view>
          </view> -->
          <view class="j-10">
            <view class="j-12">
              <button class="tn-button" v-if="item.buttons.length === 0" @click="go2Detail(item.id)">查看详情</button>

              <button class="tn-button" v-if="item.buttons.includes('appointment')" @click="toAppointment(item)">预约上门</button>

              <!-- <button class="tn-button" v-if="item.buttons.includes('construction')" @click="tn('/pages/order/constructionDetails?id=' + item.id)">查看施工</button> -->
              <button class="tn-button" v-if="item.buttons.includes('check')" @click="onCheck(item.id)">验收</button>
              <button class="tn-button" v-if="item.buttons.includes('finishPay')" @click="onFinishPay(item.finishPayOrderId)">支付余款</button>
              <button class="tn-button" v-if="item.buttons.includes('commentWorker')" @click="tn('/pages/order/quality/quality?orderId=' + item.id + '&itemId=' + item.items[0].id)">质保凭证</button>
              <button class="tn-button" v-if="item.buttons.includes('commentWorker')" @click="tn('/pages/order/comment/add?id=' + item.id)">评价师傅</button>
              <button class="tn-button" v-if="item.buttons.includes('viewWorkerComment')" @click="tn('./comment/add?id=' + item.id)">查看师傅评价</button>
            </view>
          </view>
        </view>
      </view>
      <view class="" style="margin-top: 30rpx" v-if="list.length > 0">
        <tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
        <tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
        <tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
      </view>
      <view v-if="list.length == 0" class="wu">
        <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
      </view>
    </view>
    <!-- 联系客服 -->
    <!-- <view v-if="list.length == 0" style="padding: 0 30rpx; position: fixed; left: 0; bottom: 40rpx; width: 100%"> </view> -->
    <!-- <view class="customerService" :style="{ bottom: tabHeight + 'rpx' }">
      <view class="c-2" style="border-bottom: 1rpx solid #e0e0e0">
        <button class="c-85" open-type="lifeIm">
          <view class="c-85">
            <view class="c-86">
              <text class="tn-icon-service-simple c-87"></text>
              <view class="c-88">客服</view>
              <view class="c-89">（服务时间：8:00 ~ 21:00）</view>
            </view>
            <text class="tn-icon-right c-90"></text>
          </view>
        </button>
      </view>
      <view class="c-2" @click="makePhone">
        <button class="c-85">
          <view class="c-85">
            <view class="c-86">
              <text class="tn-icon-tel c-87"></text>
              <view class="c-88">电话</view>
              <view class="c-89">（服务时间：8:00 ~ 21:00）</view>
            </view>
            <text class="tn-icon-right c-90"></text>
          </view>
        </button>
      </view>
    </view> -->

    <tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
    <tn-modal v-model="checkInfo.show" :title="checkInfo.title" :content="checkInfo.content" :button="checkInfo.button" @click="clickCheck"></tn-modal>
    <tn-modal v-model="cancelAppointmentInfo.show" :title="cancelAppointmentInfo.title" :content="cancelAppointmentInfo.content" :button="cancelAppointmentInfo.button" @click="clickCancelAppointment"></tn-modal>

    <button class="tipsBox" @click="openTipsBox" style="border-radius: 0" />

    <tn-popup v-model="tipsShow" mode="bottom" safeAreaInsetBottom>
      <view style="padding-bottom: 20rpx"
        ><view class="customerService" :style="{ bottom: tabHeight + 'rpx' }">
          <view class="c-2" style="border-bottom: 1rpx solid #e0e0e0">
            <button class="c-85" open-type="lifeIm">
              <view class="c-85">
                <view class="c-86">
                  <text class="tn-icon-service-simple c-87"></text>
                  <view class="c-88">客服</view>
                  <view class="c-89">（服务时间：8:00 ~ 21:00）</view>
                </view>
                <text class="tn-icon-right c-90"></text>
              </view>
            </button>
          </view>
          <view class="c-2" @click="makePhone">
            <button class="c-85">
              <view class="c-85">
                <view class="c-86">
                  <text class="tn-icon-tel c-87"></text>
                  <view class="c-88">电话</view>
                  <view class="c-89">（服务时间：8:00 ~ 21:00）</view>
                </view>
                <text class="tn-icon-right c-90"></text>
              </view>
            </button>
          </view> </view
      ></view>
    </tn-popup>

    <tn-tabbar v-model="currentIndex" :list="tabbarList" activeColor="#0059FF" inactiveColor="#AAAAAA" activeIconColor="#0059FF" :animation="true" :safeAreaInsetBottom="true" @change="switchTabbar"></tn-tabbar>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import customerNotice from '@/components/customerNotice'
import { timestampToTime, formatOrderStatus, handleOrderButtons } from '@/util/util.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  data() {
    return {
      types: [
        { name: '全部', status: '' },
        { name: '待预约', status: 21 },
        { name: '待派单', status: 22 },
        { name: '待上门', status: 23 },
        { name: '待施工', status: 24 },
        { name: '待验收', status: 25 },
        { name: '待付余款', status: 28 },
        { name: '已完成', status: 30 },
      ],
      current: 0,
      timestampToTime,
      formatOrderStatus,
      handleOrderButtons,
      // timestamp: 86400,
      pageNo: 1,
      status: '',
      loadText: {
        loadmore: '上拉加载更多',
        loading: '快速加载中...',
        nomore: '已经没有了啊',
      },
      loadStatus: 'loadmore',
      list: [],
      checkInfo: {
        show: false,
        title: '提示',
        content: '是否验收？',
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
      cancelAppointmentInfo: {
        show: false,
        title: '提示',
        content: '是否取消预约？',
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
      id: '',
      currentIndex: 1,
      tabHeight: 100,
      contentPaddingBottom: 100,
      tipsShow: false,
    }
  },
  onLoad(options) {
    if (options.status) {
      this.status = options.status * 1
      this.types.forEach((item, index) => {
        if (item.status === this.status) {
          this.current = index
        }
      })
    }
  },
  onShow() {
    this.currentIndex = 1
    this.pageNo = 1
    this.list = []
    this.getlist()
  },
  methods: {
    change(index) {
      this.current = index
      this.status = this.types[index].status
      this.list = []
      this.pageNo = 1
      this.getlist()
    },
    getlist() {
      this.loadStatus = 'loading'

      let data = {
        pageNo: this.pageNo,
        pageSize: 3,
        ttOpenId: uni.getStorageSync('openid'),
        status: this.status,
        commentStatus: this.status === 30 ? false : '',
      }
      let than = this
      than.$http.getRequest('app-api/trade/order/ttPage', data).then(res => {
        if (res.code == 0) {
          let arr = res.data ? res.data.list : []

          if (arr.length > 0) {
            than.pageNo = than.pageNo + 1
            arr.forEach(item => {
              this.handleOrderButtons(item)
              than.list.push(item)
            })
          }
          if (res.data && than.list.length < res.data.total) {
            than.loadStatus = 'loadmore'
          } else {
            than.loadStatus = 'nomore'
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
    onReachBottom() {
      this.getlist()
    },
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
    //详情页
    go2Detail(id) {
      uni.navigateTo({
        url: '/pages/order/detail?id=' + id,
      })
    },
    // 验收
    onCheck(id) {
      this.id = id
      this.checkInfo.show = true
    },
    // 取消预约
    cancelAppointment(id) {
      this.id = id
      this.cancelAppointmentInfo.show = true
    },
    clickCheck(e) {
      if (e.index == 0) {
        this.checkInfo.show = false
      }
      if (e.index == 1) {
        this.$http.getRequest('app-api/trade/work/checkAndAccept/' + this.id).then(res => {
          if (res.code == 0) {
            this.checkInfo.show = false
            this.$refs.toast.show({
              title: '验收成功',
              icon: 'success',
              image: '',
              duration: 1000,
            })
            this.change(6)
          } else {
            this.checkInfo.show = false
            this.$refs.tips.show({
              msg: res.msg,
              backgroundColor: '#E83A30',
              fontColor: '#FFFFFF',
              duration: 1500,
            })
          }
        })
      }
    },
    clickCancelAppointment(e) {
      if (e.index == 0) {
        this.cancelAppointmentInfo.show = false
      }
      if (e.index == 1) {
        this.$http
          .postRequest('app-api/trade/order/ttOrderCancelBook', {
            id: this.id,
          })
          .then(res => {
            if (res.code == 0) {
              this.cancelAppointmentInfo.show = false
              this.$refs.toast.show({
                title: '取消预约成功',
                icon: 'success',
                image: '',
                duration: 1000,
              })
              this.change(1)
            } else {
              this.cancelAppointmentInfo.show = false
              this.$refs.tips.show({
                msg: res.msg,
                backgroundColor: '#E83A30',
                fontColor: '#FFFFFF',
                duration: 1500,
              })
            }
          })
      }
    },
    onFinishPay(finishPayOrderId) {
      let that = this
      that.$http
        .getRequest('app-api/pay/order/get', {
          id: finishPayOrderId,
        })
        .then(res => {
          if (res.code == 0) {
            that.$http
              .postRequest('app-api/pay/order/submit', {
                id: res.data.id,
                channelCode: 'wx_lite',
                channelExtras: {
                  openid: uni.getStorageSync('openid'),
                  payType: '1',
                },
              })
              .then(res => {
                if (res.code == 0) {
                  // 调用微信小程序支付
                  let payConfig = JSON.parse(res.data.displayContent)
                  uni.requestPayment({
                    provider: 'wxpay',
                    timeStamp: payConfig.timeStamp,
                    nonceStr: payConfig.nonceStr,
                    package: payConfig.packageValue,
                    signType: payConfig.signType,
                    paySign: payConfig.paySign,
                    success: res => {
                      that.$refs.toast.show({
                        title: '支付成功',
                        icon: 'success',
                        image: '',
                        duration: 1000,
                      })
                      this.change(7)
                    },
                    fail: err => {
                      if (err.errMsg === 'requestPayment:fail cancel') {
                        that.$refs.toast.show({
                          title: '支付取消',
                          icon: 'close',
                          image: '',
                          duration: 1000,
                        })
                      } else {
                        that.$refs.toast.show({
                          title: '支付失败',
                          icon: 'close',
                          image: '',
                          duration: 1000,
                        })
                      }
                    },
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
    toAppointment(item) {
      this.tn(
        '/pages/goods/reservation?data=' +
          encodeURIComponent(
            JSON.stringify({
              items: [
                {
                  skuId: item.items[0].skuId,
                  count: item.items[0].count,
                  //  skuLength:100,
                  // skuWidth :100
                  // categoryId: that.detail.categoryId
                },
              ],
              // TODO 芋艿：后续清理掉这 2 参数
              deliveryType: 1,
              pointStatus: false,
              // ttId:this.detail.ttId,
              id: item.id,
            })
          )
      )
    },
    /**
     * 拨打电话
     */
    makePhone() {
      uni.makePhoneCall({
        phoneNumber: this.kfPhone,
      })
    },

    switchTabbar(e, pagePath) {
      this.currentIndex = e
      uni.switchTab({
        url: pagePath,
      })
    },

    openTipsBox() {
      console.log('openTipsBox')
      this.tipsShow = true
    },
  },
  mounted() {
    // 在页面 onLoad 或 mounted 钩子中
    const systemInfo = uni.getSystemInfoSync()

    const tabBarHeight = systemInfo.safeAreaInsets.bottom // 安全区域底部坐标

    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.tn-tabbar')
        .boundingClientRect(data => {
          this.tabHeight = (data.height + tabBarHeight) * 2
        })
        .exec()
      // query
      //   .select('.customerService')
      //   .boundingClientRect(data => {
      //     this.contentPaddingBottom = (data.height + tabBarHeight + 10) * 2
      //   })
      //   .exec()
    })
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
  background-color: $tn-bg1-color;
  min-height: 100vh;
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
  // background-attachment:fixed;
  background-position: top;
  border: 1rpx solid rgba(255, 255, 255, 0.05);
  box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  overflow: hidden;
  // background-color: #FFFFFF;
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
}
.c-15 {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  box-sizing: border-box;
}
.imgBox {
  width: 240rpx;
  min-width: 240rpx; /* 防止在 flex 布局中被收缩 */
  flex: 0 0 240rpx; /* 不允许收缩或增长，强制固定宽度 */
  height: 240rpx;
  border-radius: 8rpx;
  overflow: hidden;
  display: block;
  box-sizing: border-box;
  image {
    // display: inline-block;
    width: 240rpx;
    height: 240rpx;
    border-radius: 8rpx;
  }
}
.c-17 {
  // width: 430rpx;
  flex: 1;
  position: relative;
  margin-left: 22rpx;
}
.c-18 {
  color: $tn-font-title-color;
  font-size: 30rpx;
  font-weight: bold;
  // white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.explanation {
  padding: 8rpx 0;
  font-size: 24rpx;
  color: $my-font-sub-color;
}
.c-19-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}
.c-19 {
  font-size: 24rpx;
  color: $tn-font-sub1-color;
}
.c-19-box .c-19:last-child text {
  display: none;
}
.c-20 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.c-20_l {
  font-size: 24rpx;
  font-weight: 500;
  color: $my-font-sub-color;
}
.c-21 {
  color: $tn-theme-color;
}
.c-23 {
  font-size: 20rpx;
}
.c-24 {
  font-size: 32rpx;
  font-weight: bold;
}
.j-1 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: $tn-bg1-color;
}
.j-2 {
  padding: 0 30rpx;
}
.j-3 {
  background-color: white;
  border-radius: 8rpx;
  padding: 0 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}
.j-4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  border-bottom: 1px solid $tn-border-solids-color;
}
.j-5 {
  color: $tn-font-sub1-color;
}
.j-6 {
  color: $tn-theme-color;
}
.j-7-box {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid $tn-border-solids-color;
}
.j-7 {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 0;
  margin-left: 20rpx;
}
.j-9 {
  color: $tn-theme-color;
  font-weight: bold;
  font-size: 30rpx;
}
.j-10 {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid $tn-border-solids-color;
  padding: 20rpx 0;
}
.j-11 {
  font-size: 24rpx;
  display: flex;
  align-items: center;
}
.j-11 text {
  margin-left: 10rpx;
  color: $tn-theme-color;
}
.j-11 /deep/ .tn-countdown__item__time {
  font-size: 24rpx !important;
}
.j-11 /deep/ .tn-countdown__separator {
  font-size: 24rpx !important;
  color: $tn-theme-color !important;
}
.j-12 {
  display: flex;
}
/deep/ .j-12 .tn-btn {
  width: 100% !important;
}
/deep/ .j-10 .j-12 .tn-button {
  // width: 142rpx;
  height: 64rpx;
  color: $tn-bg-color;
  font-size: 24rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32rpx;
  margin-left: 20rpx !important;
  background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
}
/deep/ .j-12 .tn-button:first-child {
  margin-left: 0;
}
.j-13 {
  margin-right: 10rpx;
}
.c-2 {
  padding: 20rpx 0;
  background-color: white;
  // border-radius: 8rpx;
  // margin-top: 20rpx;
}
.c-85 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 0;
  border-radius: 0;
  margin: 0;
  line-height: initial;
  font-size: 28rpx;
  width: 100%;
}
.c-86 {
  display: flex;
  align-items: center;
}
.c-87 {
  font-size: 33rpx;
}
.c-88 {
  margin-left: 20rpx;
}
.c-89 {
  margin-left: 20rpx;
  font-size: 24rpx;
  color: $tn-font-sub1-color;
}

.customerService {
  width: 100%;
  padding: 20rpx;
  // position: fixed;
  // left: 0;
  // bottom: 100rpx;
  background-color: #fff;
  box-sizing: border-box;
}

.listBox {
  padding: 100rpx 0;
}

.tipsBox {
  position: fixed;
  bottom: 300rpx;
  right: 52rpx;
  width: 72rpx;
  height: 216rpx;
  background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0009.png) no-repeat;
  background-size: contain;
  z-index: 1000;
}
</style>
