<template>
  <view
    class="oa-content tn-padding-bottom-xl"
    :style="{
      paddingBottom: vuex_is_black_stripe ? 'calc(20px + 120rpx)' : '120rpx',
    }"
  >
    <view class="c-1">
      <view class="c-2">
        <view class="c-3" @click="tn('/pages/uesr/address/addresslist?isChoose=1')">
          <view class="c-4"><text class="tn-icon-location"></text></view>
          <view class="c-5-box" v-if="detail.address">
            <view class="c-5">
              <view class="c-6">
                <text class="c-7">{{ detail.address.name }}</text>
                <text class="c-8">{{ detail.address.mobile }}</text>
              </view>
              <view class="c-9">{{ detail.address.areaName }} {{ detail.address.detailAddress }}</view>
            </view>
            <text class="tn-icon-right"></text>
          </view>
          <view class="c-5-box" v-else>
            <view class="c-5">
              <view class="c-9" style="color: #7a8499">请补全个人信息/服务地址信息</view>
            </view>
            <text class="tn-icon-right"></text>
          </view>
        </view>
        <view class="c-3" @click="showYyModal = true">
          <view class="c-4"><text class="tn-icon-time"></text></view>
          <view class="c-5-box">
            <view class="c-5">
              <view class="c-9">
                <view class="c-10">上门时间<text class="c-12">(必填)</text></view>
                <view class="c-11">{{ appointTime ? appointTime : '请选择' }}</view>
              </view>
            </view>
            <text class="tn-icon-right"></text>
          </view>
        </view>
        <!-- 	<view class="c-3" style="border-bottom: none;">
					<view class="c-4"><text class="tn-icon-camera"></text></view>
					<view class="c-5-box">
						<view class="c-5">
							<view class="c-9">
								<view class="c-10">施工信息</view>
							</view>
						</view>
					</view>
				</view>
				<view class="c-13">
					<view class="c-14">
						 <tn-image-upload uploadText="上传施工场景照" :multiple="false" maxCount="1" :action="action" :fileList="frontFileList" @onSuccess="frontSuccess" @onRemove="frontRemove" :showProgress="false" @on-choose-complete="chooseFrontComplete" @on-error="frontError"></tn-image-upload>
					</view>
					<view class="c-14">
						 <tn-image-upload uploadText="上传施工对象照" :multiple="false" maxCount="1" :action="action" :fileList="backFileList" @onSuccess="backSuccess" @onRemove="backRemove" :showProgress="false" @on-choose-complete="chooseBackComplete" @on-error="backError"></tn-image-upload>
					</view>
				</view> -->
      </view>
      <view class="c-2" v-for="(item, index) in detail.items" :key="index">
        <view class="c-15">
          <image v-if="item.picUrl" class="c-16" :src="item.picUrl" lazy-load="true"></image>
          <image v-else class="c-16" src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0022.png" lazy-load="true"></image>
          <view class="c-17">
            <view class="c-18">{{ item.spuName }}</view>
            <view class="c-19-box">
              <view class="c-19" v-for="(item1, index1) in item.properties" :key="index1">{{ item1.propertyName + ':' + item1.valueName }}<text>/</text></view>
            </view>
            <view class="c-20">
              <view class="c-21"
                ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item.price / 100).toFixed(2)) }}</text></view
              >
            </view>
          </view>
        </view>
      </view>

      <!-- <view class="order_t" v-for="(item, index) in detail.items" :key="index">
        <view class="order_tl">
          <image class="" :src="item.picUrl" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
        </view>
        <view class="order_tr">
          <view class="order_trt">{{ item.spuName }}</view>
          <view class="order_trc"> 全国通用 | 随时退</view>
          <view class="order_trb">
            <view class="order_trbl"
              >共 <text>{{ 1 }}</text> 张</view
            >
            <view class="order_trbr"
              ><view class="order_trbrl">￥</view><view class="order_trbrr">{{ $base.f2y(item.price) }}</view></view
            >
          </view>
        </view>
      </view> -->

      <view class="priceBox">
        <view class="priceBox_t"> 费用明细 </view>
        <view class="priceBox_c">
          <view class="priceBox_cl">订单总价：</view>
          <view class="priceBox_cr">￥{{ $base.f2y(payPrice) }} </view>
        </view>
      </view>
      <!-- <view class="c-2">
        <view class="c-25">费用明细</view>
        <view class="c-26-box">
          <view class="c-26" style="margin-bottom: 0">
            <view class="c-27">团购价格</view>
            <view class="c-28">￥{{ parseFloat((payPrice / 100).toFixed(2)) }}</view>
          </view>
        </view>
      </view> -->
      <view class="c-2">
        <view class="c-25">备注说明</view>
        <view class="c-32">
          <!-- <view class="c-33">备注</view> -->
          <view class="c-34">
            <!-- <tn-input class="c-35" v-model="remark" placeholder="请填写" :clearable="false" /> -->
            <textarea v-model="remark" placeholder="请填写备注" />
          </view>
        </view>
      </view>

      <view class="order_c">
        <view class="order_ct">服务流程</view>
        <view class="order_ci" v-for="(v, i) in serveList" :key="i">
          <view class="order_cil">
            <image class="" :src="v.img" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
          </view>
          <view class="order_cir">
            <view class="order_cirt"
              >第<text>{{ i + 1 }}</text
              >步：{{ v.title }}</view
            >
            <view class="order_circ">{{ v.explanation }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 悬浮按钮-->
    <view
      class="tn-flex tn-footerfixed tn-padding"
      :style="{
        paddingBottom: vuex_is_black_stripe ? 'calc(20px + 20rpx)' : '',
      }"
    >
      <view class="tn-flex tn-flex-1 justify-content-item tn-text-center c-38">
        <!-- <view class="c-35">
					<view class="c-36"><text>￥</text>{{ parseFloat((detail.price.totalPrice / 100).toFixed(2)) }}</view>
					<view class="c-37">预约上门</view>
				</view> -->
        <!-- <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="onConfirm">
          <text class="">预约上门</text>
        </tn-button> -->

        <button open-type="lifeIm" class="c-38_l">
          <image class="" src="https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0010.png" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
          客服
        </button>

        <view class="c-38_r" @click="onConfirm" v-if="confirmShow">确认预约</view>
        <view class="c-38_r c-38_r_act" :disabled="true" v-else>确认预约</view>
      </view>
    </view>
    <!-- 选择上门时间-->
    <tn-popup v-model="showYyModal" mode="bottom" closeBtn="true" borderRadius="16" height="60%" closeBtnIcon="close-fill">
      <view class="c-56">
        <view class="c-57">选择上门时间</view>
        <view class="c-76">
          <scroll-view class="c-77" scroll-x>
            <view class="c-78-box">
              <view :class="['c-78', active_index == index ? 'active' : '']" v-for="(item, index) in days" :key="index" @click="switchDay(index)">
                <view class="c-79-box">
                  <view class="c-79">{{ index === 0 ? '明天' : index == 1 ? '后天' : item[1] }}</view>
                  <view class="c-79">{{ item[0] }}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view
          class="c1-58"
          :style="{
            height: vuex_is_black_stripe ? 'calc(100% - 20px - 199rpx - 120rpx)' : 'calc(100% - 199rpx - 120rpx)',
          }"
        >
          <scroll-view scroll-y class="c-58-box" :style="{ height: '100%' }">
            <view class="c-80-box">
              <view class="c1-80-box" v-if="times.length > 0">
                <view :class="['c-80', selectTime == item ? 'active' : '']" v-for="(item, index) in times" :key="index" @click="switchTime(item)">
                  <view class="c-81-box">
                    <view class="c-81">{{ item }}</view>
                    <view class="c-82">可预约</view>
                  </view>
                </view>
              </view>
              <view v-else style="padding-top: 50rpx">
                <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="今天暂无可选时间,您可以选择后面的时间"></tn-empty>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="c-65">
          <view class="c-69" style="width: 100%">
            <tn-button class="tn-button" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="reservation">
              <text class="">确认上门时间</text>
            </tn-button>
          </view>
        </view>
      </view>
    </tn-popup>
    <tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
    <!-- <tn-loading mode="circle" :show="true"></tn-loading> -->
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import { timestampToTime } from '@/util/util.js'
import store from '../../store/index.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  data() {
    return {
      days: [],
      active_index: 0,
      times: [],
      rawTimes: [],
      treatedTimes: [],
      selectTime: '',
      appointTime: '',

      showYyModal: false,
      orderParameter: '',
      orderPayload: '',
      detail: {
        price: {
          payPrice: 0,
          totalPrice: 0,
        },
        address: null,
      },
      action: '',
      frontFileList: [],
      backFileList: [],
      areaImages: '',
      areaToolImages: '',
      remark: '',
      orderId: '',
      payPrice: 0,

      serveList: [
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0013.png', title: '购买下单', explanation: '点击商品详情页“立即下单”按钮并支付订单' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0014.png', title: '预约上门', explanation: '找到自己的订单并填写上门地址、时间，施工场景照片等基础信息' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0015.png', title: '等待服务', explanation: '预约完成后，保持电话畅通，客服/师傅将第一时间与您联系确认订单信息' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0016.png', title: '施工验收', explanation: '检查施工结果,如有问题立即与师傅/客服沟通' },
      ],

      confirmShow: true, //确认预约按钮是否可点击
    }
  },
  onLoad(options) {
    // this.detail = JSON.parse(options.detail)
    // console.log('detail',this.detail)
    this.days = this.getNext7Days()
    this.getHalfHourIntervalsFrom9To20()
    if (options.data) {
      this.orderParameter = JSON.parse(decodeURIComponent(options.data))
      this.orderPayload = JSON.parse(decodeURIComponent(options.data))
      this.orderId = this.orderPayload.id
      this.getDetail()
      console.log(this.orderPayload)
      delete this.orderParameter.items
      for (let i = 0; i < this.orderPayload.items.length; i++) {
        this.orderParameter[encodeURIComponent('items[' + i + '' + '].skuId')] = this.orderPayload.items[i].skuId + ''
        this.orderParameter[encodeURIComponent('items[' + i + '' + '].count')] = this.orderPayload.items[i].count + ''
        // this.orderParameter[encodeURIComponent('items[' + i + '' + '].skuLength')] = this.orderPayload.items[i].skuLength + '';
        // this.orderParameter[encodeURIComponent('items[' + i + '' + '].skuWidth')] = this.orderPayload.items[i].skuWidth + '';
        if (this.orderPayload.items[i].cartId) {
          this.orderParameter[encodeURIComponent('items[' + i + '' + '].cartId')] = this.orderPayload.items[i].cartId + ''
        }
      }
      let queryString = Object.keys(this.orderParameter)
        .map(key => key + '=' + this.orderParameter[key])
        .join('&')
      this.getOrderInfo(queryString)
    }
  },
  onShow() {
    this.action = this.$http.commoneUrl + 'app-api/infra/file/upload'
    console.log('vuex_is_black_stripe', this.vuex_is_black_stripe)
    if (this.detail.address) {
      this.$http.getRequest('app-api/member/address/get?id=' + this.detail.address.id).then(res => {
        if (res.code == 0) {
          if (!res.data) {
            this.detail.address = null
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
    }
  },
  methods: {
    getNext7Days() {
      let today = new Date() // 获取当前日期
      let days = [] // 用于存储接下来7天的日期和周几

      for (let i = 1; i < 90; i++) {
        let date = new Date(today) // 复制今天的日期
        date.setDate(today.getDate() + i) // 设置新的日期为今天加i天

        // 格式化日期为月/日，以及获取周几
        let month = date.getMonth() + 1 // 月份是从0开始的，所以需要+1
        let day = date.getDate()
        let year = date.getFullYear() // 如果你还需要年份
        let weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()] // 获取周几

        // 为了月份和日期为个位数时前面补0
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day

        // 将格式化的日期和周几存入数组
        days.push([month + '/' + day, weekDay, year])
      }
      if (this.detail.appointTime) {
        // console.log('timeStr',1111)
        days.forEach((item, index) => {
          let timeStr = days[index][2] + '-' + days[index][0].replace('/', '-')
          if (this.timestampToTime(this.detail.appointTime).substring(0, 10) == timeStr) {
            this.appointTime = (index == 0 ? '明天' : index == 1 ? '后天' : item[1]) + this.timestampToTime(this.detail.appointTime).substring(11, 16)
          }
        })
      }
      return days
    },
    switchDay(index) {
      this.active_index = index
      if (index !== 0) {
        this.times = JSON.parse(JSON.stringify(this.rawTimes))
      } else {
        this.times = JSON.parse(JSON.stringify(this.treatedTimes))
        if (this.times.length <= 0) {
          this.selectTime = ''
          return
        } else {
          if (!this.times.includes(this.selectTime)) {
            this.selectTime = ''
            return
          }
        }
      }
    },
    switchTime(time) {
      this.selectTime = time
    },
    getHalfHourIntervalsFrom9To20() {
      let now = new Date() // 获取当前日期和时间
      let currentHour = now.getHours() // 获取当前小时数
      let currentMinute = now.getMinutes() // 获取当前分钟数
      let currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}` // 格式化当前时间为字符串

      // 初始化时间数组
      let intervals = []

      // 生成从9:00到20:30的所有半小时点（包括两端）
      for (let hour = 9; hour <= 20; hour++) {
        intervals.push(`${hour.toString().padStart(2, '0')}:00`) // 每个小时的0分钟点
        if (hour < 20) {
          // 不为20点时添加30分钟点
          intervals.push(`${hour.toString().padStart(2, '0')}:30`)
        }
      }
      this.rawTimes = JSON.parse(JSON.stringify(intervals))
      // 移除当前时间已经超过的时间点
      let i = intervals.length - 1 // 从后往前遍历，避免移除时索引变化影响
      while (i >= 0) {
        if (intervals[i] < currentTime) {
          intervals.splice(i, 1) // 移除当前时间点
        }
        i--
      }
      this.treatedTimes = JSON.parse(JSON.stringify(intervals))
      this.times = JSON.parse(JSON.stringify(intervals))
    },
    getOrderInfo(queryString) {
      let that = this
      that.$http.getRequest(`app-api/trade/order/settlement?${queryString}`).then(res => {
        if (res.code == 0) {
          that.detail = res.data
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
    reservation() {
      if (!this.selectTime) {
        this.$refs.tips.show({
          msg: '请先选择预约时间',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      this.showYyModal = false
      this.appointTime = this.days[this.active_index][2] + '-' + this.days[this.active_index][0].replace('/', '-') + ' ' + this.selectTime + ':00'
      let appointTime1 = this.days[this.active_index][2] + '-' + this.days[this.active_index][0].replace('/', '-') + 'T' + this.selectTime + ':00'
      let dateTime = new Date(appointTime1)
      // 半小时的毫秒数
      let halfHour = 30 * 60 * 1000 // 30分钟 * 60秒/分钟 * 1000毫秒/秒
      // 将时间往后推半小时
      dateTime.setTime(dateTime.getTime() + halfHour)
      // 格式化日期时间（这里使用简单的模板字符串和条件（三元）运算符）
      this.appointEndTime = `${dateTime.getFullYear()}-${('0' + (dateTime.getMonth() + 1)).slice(-2)}-${('0' + dateTime.getDate()).slice(-2)} ${('0' + dateTime.getHours()).slice(-2)}:${('0' + dateTime.getMinutes()).slice(-2)}:${(
        '0' + dateTime.getSeconds()
      ).slice(-2)}`
    },
    // 提交订单
    onConfirm() {
      uni.showLoading({
        title: '提交预约中...',
      })
      console.log('this.areaImages', this.areaImages)
      console.log('this.areaToolImages', this.areaToolImages)
      this.confirmShow = false
      if (!this.detail.address) {
        this.confirmShow = true
        uni.hideLoading()
        this.$refs.tips.show({
          msg: '请选择收货地址',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      if (!this.appointTime) {
        uni.hideLoading()
        this.confirmShow = true
        this.$refs.tips.show({
          msg: '请先选择预约时间',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      //  if (!this.areaImages) {
      //   this.$refs.tips.show({
      //   	  msg: '请先上传施工环境照片',
      //   	  backgroundColor: '#E83A30',
      //   	  fontColor: '#FFFFFF',
      //   	  duration: 1500
      //   	})
      //    return;
      //  }
      //  if (!this.areaToolImages) {
      // this.$refs.tips.show({
      // 	  msg: '请先上传施工家具照片',
      // 	  backgroundColor: '#E83A30',
      // 	  fontColor: '#FFFFFF',
      // 	  duration: 1500
      // 	})
      //    return;
      //  }
      this.submitOrder()
    },
    submitOrder() {
      let that = this
      // that.confirmShow = true
      // uni.hideLoading()
      // setTimeout(() => {
      // }, 5000)

      // return false

      that.$http
        .postRequest(`app-api/trade/order/ttOrderCommit`, {
          id: this.orderPayload.id,
          addressId: this.detail.address.id,
          appointTime: this.appointTime,
          areaImages: this.areaImages,
          areaToolImages: this.areaToolImages,
          remark: this.remark,
        })
        .then(res => {
          if (res.code == 0) {
            if (that.orderPayload.items[0].cartId > 0) {
              that.$http.getRequest('app-api/trade/cart/list').then(res => {
                if (res.code == 0) {
                  let validList = res.data.validList
                  if (validList.length > 0) {
                    validList.forEach((item, index) => {
                      let count = parseFloat((item.count / 10000).toFixed(2))
                      item.count = count
                    })
                  }
                  store.commit('$tStore', {
                    name: 'cartList',
                    value: validList,
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
            }
            uni.hideLoading()
            this.confirmShow = true
            that.$refs.toast.show({
              title: '预约成功',
              icon: 'success',
              image: '',
              duration: 1000,
            })
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/orderList/index',
              })
            }, 500)
            // this.changeAppointTime(res.data.id)
            // this.getPayOrder(res.data.payOrderId)
          } else {
            uni.hideLoading()
            this.confirmShow = true
            this.$refs.tips.show({
              msg: res.msg,
              backgroundColor: '#E83A30',
              fontColor: '#FFFFFF',
              duration: 1500,
            })
          }
        })
    },
    changeAppointTime(id) {
      let that = this
      that.$http
        .putNewRequest(`app-api/trade/work/changeAppointTime`, {
          appointEndTime: that.appointEndTime,
          appointTime: that.appointTime,
          orderId: id,
        })
        .then(res => {
          if (res.code == 0) {
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
    getPayOrder(id) {
      let that = this
      that.$http
        .getRequest('app-api/pay/order/get', {
          id: id,
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
                  // console.log(res)
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
                      setTimeout(() => {
                        uni.switchTab({
                          url: '/pages/orderList/index',
                        })
                      }, 500)
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
    getDetail() {
      this.fileList = []
      this.$http
        .getRequest('app-api/trade/order/get-detail', {
          id: this.orderId,
        })
        .then(res => {
          if (res.code == 0) {
            this.payPrice = res.data.payPrice
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
    chooseFrontComplete() {
      uni.showLoading({
        title: '上传中...',
      })
    },
    chooseBackComplete() {
      uni.showLoading({
        title: '上传中...',
      })
    },
    frontSuccess(data, index, lists, name) {
      uni.hideLoading()
      if (data.code == 0) {
        this.areaImages = data.data
      } else {
        this.areaImages = ''
      }
    },
    backSuccess(data, index, lists, name) {
      console.log('this.areaImages', this.areaImages)
      uni.hideLoading()
      if (data.code == 0) {
        this.areaToolImages = data.data
      } else {
        this.areaToolImages = ''
      }
    },
    frontError() {
      uni.hideLoading()
      this.$refs.tips.show({
        msg: '上传失败',
        backgroundColor: '#E83A30',
        fontColor: '#FFFFFF',
        duration: 1500,
      })
    },
    backError() {
      uni.hideLoading()
      this.$refs.tips.show({
        msg: '上传失败',
        backgroundColor: '#E83A30',
        fontColor: '#FFFFFF',
        duration: 1500,
      })
    },
    frontRemove(index, lists, name) {
      this.areaImages = ''
    },
    backRemove(index, lists, name) {
      this.areaToolImages = ''
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
  padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
}
/* 间隔线 end*/

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
  padding: 20rpx 0rpx;
  box-sizing: border-box;
}

/deep/ .tn-button button {
  background: linear-gradient(130.69deg, #0059ff 0%, #004ad4 100%);
  // box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
}
/deep/ .tn-icon-close-fill {
  font-size: 40rpx !important;
  color: $tn-font-title-color !important;
}
/* 底部悬浮按钮 end*/
/deep/ .time-line-item__content__time {
  color: #a29e9e;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.c-1 {
  width: 100%;
  height: 100%;
  padding: 20rpx 30rpx;
  padding-bottom: 30rpx;
  box-sizing: border-box;
}
.c-2 {
  padding: 0 24rpx;
  padding-bottom: 20rpx;
  background-color: white;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}
.c-3 {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid $tn-border-solids-color;
}
.c-4 {
  font-size: 35rpx;
}
.c-7 {
  font-size: 30rpx;
  color: $tn-font-title-color;
  font-weight: bold;
}
.c-8 {
  font-size: 24rpx;
  color: $tn-font-sub1-color;
  margin-left: 10rpx;
}
.c-5-box {
  margin-left: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 600rpx;
}
.c-9 {
  width: 550rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  color: $tn-font-title-color;
}
.c-11 {
  font-size: 24rpx;
}
.c-12 {
  color: $tn-theme-color;
}
.c-13 {
  display: flex;
  justify-content: space-between;
}
.c-14 /deep/ .tn-image-upload__item {
  background-color: transparent !important;
  width: 315rpx !important;
  height: 212rpx !important;
  margin: 0 !important;
  border-radius: 16rpx;
  border: 1rpx dashed $tn-border-solids-color;
}
.c1-14 /deep/ .tn-image-upload__add {
  background-image: url('https://www.tmsglm.com/statics/front_img.png');
  background-size: 100% 100%;
}
.c-15 {
  display: flex;
  justify-content: space-between;
}
.c-16 {
  width: 176rpx;
  height: 176rpx;
  border-radius: 8rpx;
}
.c-17 {
  width: 450rpx;
  position: relative;
}
.c-18 {
  color: $tn-font-title-color;
  font-size: 30rpx;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.c-21 {
  color: $tn-theme-color;
}
.c-23 {
  font-size: 24rpx;
}
.c-24 {
  font-weight: bold;
}
.c-25 {
  width: 100%;
  height: 92rpx;
  display: flex;
  align-items: center;
  color: $tn-font-title-color;
  font-size: 30rpx;
  padding-top: 0;
  font-weight: bold;
}
.c-26-box {
  margin-top: 20rpx;
}
.c-26 {
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.c1-26 {
  padding: 20rpx 0;
  border-top: 1rpx solid $tn-border-solids-color;
  border-bottom: 1rpx solid $tn-border-solids-color;
}
.c-27 {
  color: $tn-font-sub1-color;
  display: flex;
  align-items: center;
}
.c-27 text {
  margin-left: 10rpx;
}
.c-28 {
  display: flex;
  align-items: center;
}
.c-28 text {
  margin-left: 10rpx;
}
.c1-28 {
  font-size: 24rpx;
}
.c-29 {
  display: flex;
  justify-content: flex-end;
}
.c-31 {
  color: $tn-theme-color;
  font-weight: bold;
}
.c-32 {
  // margin-top: 20rpx;
  // display: flex;
  // align-items: center;
}
.c-33 {
  color: $tn-font-sub1-color;
}
.c-34 {
  width: 648rpx;
  height: 128rpx;
  border-radius: 16rpx;
  background: $tn-smallLabel-bg-color;
  padding: 20rpx 24rpx;
  box-sizing: border-box;
  textarea {
    width: 100%;
    height: 80rpx;
  }
}
.c-35 {
  flex: 2;
  display: flex;
  align-items: center;
}
.c-36 {
  color: $tn-theme-color;
  font-weight: bold;
}
.c-36 text {
  font-weight: initial;
  font-size: 24rpx;
}
.c-37 {
  margin-left: 20rpx;
}
.c-38 {
  width: 100%;
  padding: 0 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .c-38_l {
    background: $tn-bg-color;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: $my-font-title-color;
    margin: 0;
    padding: 0;
    image {
      display: inline-block;
      width: 56rpx;
      height: 56rpx;
      margin-right: 8rpx;
    }
  }
  .c-38_r {
    width: 240rpx;
    height: 88rpx;
    border-radius: 44rpx;
    background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: 600;
    color: $tn-bg-color;
  }
  .c-38_r_act {
    background: $my-font-sub-color;
  }
}
.c-39 {
  flex: 1;
}

.c-56 {
  padding: 0 30rpx;
  height: 100%;
}
.c-57 {
  font-size: 32rpx;
  color: $tn-font-title-color;
  text-align: center;
  font-weight: bold;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.c-58-box {
  overflow-y: auto;
  // padding-bottom: 30rpx;
  box-sizing: border-box;
}
.c1-58 {
  margin-left: -30rpx;
  width: calc(100% + 60rpx);
  background-color: #f7f8f9;
}
.c-58 {
  border-radius: 8rpx;
  background: #f7f8f9;
  padding: 20rpx;
  color: $tn-middle-color;
}
.c-59 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
}
.c-60 {
  font-size: 24rpx;
}
.c-61 .tn-radio-group-class tn-radio:last-child /deep/ .tn-radio__label {
  margin-right: 0 !important;
}
.c-62 {
  display: flex;
  align-items: center;
  border-radius: 6rpx;
  background: #f7f8f9;
  padding-right: 15rpx;
}
.c-63 {
  width: 150rpx;
  padding: 0 15rpx;
  box-sizing: border-box;
  height: 60rpx;
  text-align: center;
}
.c-64 {
  border-left: 1rpx solid $tn-middle-color;
  padding-left: 10rpx;
}
.c-65 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  width: calc(100% + 60rpx);
  position: relative;
  left: -30rpx;
  box-sizing: border-box;
  box-shadow: 0 -7rpx 10rpx -5rpx rgba(0, 0, 0, 0.5);
}
.c-66 {
  display: flex;
  align-items: center;
}
.c-67 {
  color: $tn-dot-color;
  font-weight: bold;
}
.c-68 {
  font-size: 40rpx;
}
.c-69 {
  width: 342rpx;
}
.c-70 {
  display: flex;
  align-items: center;
  color: $tn-theme-color;
  font-size: 24rpx;
  margin-left: 20rpx;
}
.c-71 {
  margin-left: 10rpx;
}
.c-72 {
  padding: 30rpx;
  padding-top: 90rpx;
}
.c-73 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.c-74 {
  color: $tn-middle-color;
}
.c-76 {
  width: calc(100% + 60rpx);
  margin-left: -30rpx;
  border-top: 1rpx solid #d6d6d6;
}
.c-78-box {
  white-space: nowrap;
}
.c-78 {
  display: inline-flex;
  width: 112rpx;
  height: 98rpx;
  justify-content: center;
  align-items: center;
  color: $tn-middle-color;
  text-align: center;
}
.c-78.active {
  background-color: #f7f8f9;
  color: $tn-theme-color;
}
.c-80-box {
  padding: 30rpx;
}
.c1-80-box {
  display: flex;
  flex-wrap: wrap;
  gap: 25rpx;
}
.c-80 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 214rpx;
  height: 110rpx;
  border-radius: 16rpx;
  border: 1rpx solid #00091a;
  text-align: center;
}
.c-80.active {
  background-color: $tn-theme-color;
  color: white;
  // box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
  border-color: $tn-theme-color;
}
.c-81 {
  font-weight: bold;
  color: $tn-font-title-color;
}
.c-80.active .c-81 {
  color: white;
}
.c-82 {
  font-size: 24rpx;
}
/* 间隔线 end*/

.order_t {
  width: 694rpx;
  padding: 16rpx 24rpx;
  // height: 272rpx;
  background-color: #fff;
  border-radius: 16rpx;
  display: flex;
  margin-bottom: 16rpx;
  .order_tl {
    width: 240rpx;
    height: 240rpx;
    border-radius: 8rpx;
    overflow: hidden;
    image {
      width: 240rpx;
      height: 240rpx;
      border-radius: 8rpx;
      overflow: hidden;
    }
  }
  .order_tr {
    flex: 1;
    margin-left: 20rpx;
    .order_trt {
      font-size: 28rpx;
      font-weight: 500;
      line-height: 40rpx;
      color: $tn-font-title-color;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 限制文本为2行 */
      overflow: hidden;
      margin-bottom: 12rpx;
    }
    .order_trc {
      font-size: 24rpx;
      font-weight: 500;
      color: $my-font-sub-color;
      margin-bottom: 62rpx;
    }
    .order_trb {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .order_trbl {
        font-size: 24rpx;
        font-weight: 500;
        color: $my-font-sub-color;
        text {
          color: $tn-font-title-color;
        }
      }
      .order_trbr {
        display: flex;
        height: 36rpx;
        .order_trbrl {
          font-size: 20rpx;
          color: #0059ff;
          padding-top: 6rpx;
          box-sizing: border-box;
        }
        .order_trbrr {
          font-size: 36rpx;
          font-weight: 600;
          color: #0059ff;
        }
      }
    }
  }
}

.priceBox {
  width: 100%;
  height: 182rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
  background-color: $tn-bg-color;
  border-radius: 16rpx;
  box-sizing: border-box;
  overflow: hidden;
  .priceBox_t {
    width: 100%;
    height: 88rpx;
    display: flex;
    align-items: center;
    font-size: 32rpx;
    font-weight: 600;
    color: $tn-font-title-color;
    border-bottom: 1rpx solid $my-bd-color;
    box-sizing: border-box;
  }
  .priceBox_c {
    width: 100%;
    height: 94rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .priceBox_cl {
      font-size: 28rpx;
      color: $my-font-sub-color;
    }
    .priceBox_cr {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      font-weight: 500;
      color: $tn-font-title-color;
    }
  }
}

.order_c {
  width: 100%;
  background-color: #fff;
  padding: 0 24rpx;
  border-radius: 16rpx;
  padding-bottom: 24rpx;
  box-sizing: border-box;
  .order_ct {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0px;
    line-height: 44px;
    color: #00091a;
  }
  .order_ci {
    width: 100%;
    border-radius: 16rpx;
    background: $tn-smallLabel-bg-color;
    padding: 20rpx 16rpx;
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    box-sizing: border-box;
    &:last-child {
      margin-bottom: 0;
    }
    .order_cil {
      width: 88rpx;
      height: 88rpx;
      image {
        display: inline-block;
        width: 88rpx;
        height: 88rpx;
      }
    }
    .order_cir {
      width: 100%;
      margin-left: 16rpx;
      margin-bottom: 10rpx;
      .order_cirt {
        font-size: 28rpx;
        font-weight: 600;
        color: $tn-font-color;
        text {
          color: $tn-theme-color;
        }
      }
      .order_circ {
        font-size: 24rpx;
        line-height: 34rapx;
        color: $my-font-title-color;
      }
    }
  }
}
</style>
