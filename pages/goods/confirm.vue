<template>
  <view class="oa-content tn-padding-bottom-xl" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 120rpx)' : '120rpx' }">
    <view class="c-1">
      <view class="c-2" v-for="(item, index) in detail.items" :key="index">
        <view class="c-15">
          <image class="c-16" :src="item.picUrl"></image>
          <view class="c-17">
            <view class="c-18">{{ item.spuName }}</view>
            <view class="c-19-box">
              <view class="c-19" v-for="(item1, index1) in item.properties" :key="index1">{{ item1.propertyName + ':' + item1.valueName }}<text>/</text></view>
            </view>
            <view class="c-20">
              <view class="c-21"
                ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((activityInfo ? activityInfo.activityPrice / 100 : item.price / 100).toFixed(2)) }}</text></view
              >
              <!-- 	<view class="c-22">x{{item.count / 10000}}m²</view> -->
            </view>
          </view>
        </view>
      </view>
      <view class="c-2">
        <view class="c-25">费用明细</view>
        <view class="c-26-box">
          <view class="c-26" style="margin-bottom: 0">
            <view class="c-27">团购价格</view>
            <view class="c-28">￥{{ parseFloat((activityInfo ? activityInfo.activityPrice / 100 : detail.price.totalPrice / 100).toFixed(2)) }}</view>
          </view>
          <!-- <view class="c-26">
						<view class="c-27">施工费
							<text class="tn-icon-help"></text>
					    </view>
						<view class="c-28">待师傅上门确认</view>
					</view> -->
          <!-- 	<view class="c-29">
						<text class="c-30">团购价格：</text>
						<text class="c-31">￥{{ parseFloat((detail.price.totalPrice / 100).toFixed(2)) }}</text>
					</view> -->
        </view>
      </view>

      <view class="c-2">
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
      <!-- 	<view class="c-2">
				<view class="c-25">施工说明</view>
				<view class="c-32">
					<view class="c-33">备注</view>
					<view class="c-34">
						<tn-input class="c-35" v-model="remark" placeholder="请填写" :clearable="false"/>
					</view>
				</view>
			</view> -->
    </view>
    <!-- 悬浮按钮-->
    <view class="tn-flex tn-footerfixed tn-padding" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 20rpx)' : '' }">
      <view class="tn-flex tn-flex-1 justify-content-item tn-text-center c-38">
        <view class="c-35">
          <view class="c-36"><text>￥</text>{{ parseFloat((activityInfo ? activityInfo.activityPrice / 100 : detail.price.totalPrice / 100).toFixed(2)) }}</view>
          <view class="c-37">预约上门</view>
        </view>
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="onConfirm">
          <text class="">提交订单</text>
        </tn-button>
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
                  <view class="c-79">{{ index === '' ? '今天' : index === 0 ? '明天' : index == 1 ? '后天' : item[1] }}</view>
                  <view class="c-79">{{ item[0] }}</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="c1-58" :style="{ height: vuex_is_black_stripe ? 'calc(100% - 20px - 199rpx - 120rpx)' : 'calc(100% - 199rpx - 120rpx)' }">
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
      },
      action: '',
      frontFileList: [],
      backFileList: [],
      areaImages: '',
      areaToolImages: '',
      remark: '',
      activityInfo: null,
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
      if (this.orderParameter.activityInfo) {
        this.activityInfo = this.orderParameter.activityInfo
      }
      delete this.orderParameter.activityInfo
      delete this.orderPayload.activityInfo
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
  },
  methods: {
    getNext7Days() {
      let today = new Date() // 获取当前日期
      let days = [] // 用于存储接下来7天的日期和周几

      for (let i = 1; i < 7; i++) {
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
      // if(this.detail.appointTime){
      // 	// console.log('timeStr',1111)
      // 	days.forEach((item,index)=>{
      // 		let timeStr = days[index][2] + '-' + days[index][0].replace("/", "-")
      // 		if(this.timestampToTime(this.detail.appointTime).substring(0,10)==timeStr){
      // 			this.appointTime = (index==0?'今天':index==1?'明天':index==2?'后天':item[1]) + (this.timestampToTime(this.detail.appointTime).substring(11,16))
      // 		}
      // 	})
      // }
      return days
    },
    switchDay(index) {
      this.active_index = index
      // if(index!==0){
      this.times = JSON.parse(JSON.stringify(this.rawTimes))
      // }else{
      // 	this.times = JSON.parse(JSON.stringify(this.treatedTimes))
      // 	if(this.times.length<=0){
      // 		this.selectTime = ''
      // 		return
      // 	}else{
      // 		if(!this.times.includes(this.selectTime)){
      // 			this.selectTime = ''
      // 			return
      // 		}
      // 	}
      // }
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
      // this.treatedTimes = JSON.parse(JSON.stringify(intervals))
      this.times = JSON.parse(JSON.stringify(this.rawTimes))
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
      console.log('this.areaImages', this.areaImages)
      console.log('this.areaToolImages', this.areaToolImages)
      //  if (!this.detail.address.id) {
      // this.$refs.tips.show({
      // 	  msg: '请选择收货地址',
      // 	  backgroundColor: '#E83A30',
      // 	  fontColor: '#FFFFFF',
      // 	  duration: 1500
      // 	})
      //    return;
      //  }
      //  if (!this.appointTime) {
      // this.$refs.tips.show({
      // 	  msg: '请先选择预约时间',
      // 	  backgroundColor: '#E83A30',
      // 	  fontColor: '#FFFFFF',
      // 	  duration: 1500
      // 	})
      //    return;
      //  }
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
      this.reservationDy()
    },
    // 创建订单&跳转
    reservationDy() {
      let that = this
      uni.showLoading({
        title: '支付请求中...',
      })
      console.log('this.orderPayload.ttProductType', that.orderPayload.ttProductType)
      console.log('this.orderPayload.ttId', that.orderPayload.ttId)
      // console.log('that.activityInfo.calculationResult.orderCalculationResultInfo',that.activityInfo.calculationResult.orderCalculationResultInfo)
      if (that.activityInfo) {
        that.activityInfo.calculationResult.orderCalculationResultInfo.marketingInfo = that.activityInfo.calculationResult.orderCalculationResultInfo.marketingDetailInfo
        delete that.activityInfo.calculationResult.orderCalculationResultInfo.marketingDetailInfo
        that.activityInfo.calculationResult.goodsCalculationResultInfo[0].marketingInfo = that.activityInfo.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo
        delete that.activityInfo.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo
        that.activityInfo.calculationResult.itemCalculationResultInfo[0].marketingInfo = that.activityInfo.calculationResult.itemCalculationResultInfo[0].marketingDetailInfo
        delete that.activityInfo.calculationResult.itemCalculationResultInfo[0].marketingDetailInfo
      }
      console.log('that.activityInfo', that.activityInfo)
      if (that.orderPayload.ttProductType != 22) {
        tt.createOrder({
          goodsList: [
            {
              quantity: 1, // 购买数量 必填
              price: that.detail.price.totalPrice, // 商品价格 必填
              goodsName: that.detail.items[0].spuName, // 商品名称 必填
              goodsPhoto: that.detail.items[0].picUrl, // 商品图片链接 必填
              goodsId: that.orderPayload.ttId, // 商品ID 必填
              goodsType: 1, // 商品类型 必填
              // goodsLabels: ["不可退"], // 商品标签 非必填
              dateRule: '', // 使用规则 非必填
              discountAmount: that.activityInfo ? that.activityInfo.discountAmount : 0,
            },
          ],
          payment: {
            totalAmount: that.detail.price.totalPrice, // 订单总价 必填
            totalDiscountAmount: that.activityInfo ? that.activityInfo.discountAmount : 0,
          },
          discount_amount: that.activityInfo ? that.activityInfo.discountAmount : 0,
          total_amount: that.detail.price.totalPrice,
          discountInfo: that.activityInfo
            ? {
                type: 1,
                detail: {
                  orderDiscount: that.activityInfo.calculationResult.orderCalculationResultInfo,
                  goodsDiscount: that.activityInfo.calculationResult.goodsCalculationResultInfo,
                  itemDiscount: that.activityInfo.calculationResult.itemCalculationResultInfo,
                },
              }
            : undefined,
          success: res => {
            const { orderId, outOrderNo } = res
            console.log('success res', res)
            console.log('orderId', orderId, 'outOrderNo', outOrderNo)
            uni.redirectTo({
              url:
                '/pages/goods/reservation?data=' +
                encodeURIComponent(
                  JSON.stringify({
                    items: [
                      {
                        skuId: that.detail.items[0].skuId,
                        count: that.detail.items[0].count,
                        //  skuLength:100,
                        // skuWidth :100
                        // categoryId: that.detail.categoryId
                      },
                    ],
                    // TODO 芋艿：后续清理掉这 2 参数
                    deliveryType: 1,
                    pointStatus: false,
                    // ttId:this.detail.ttId,
                    id: outOrderNo,
                  })
                ),
            })
            uni.hideLoading()
          },
          fail: res => {
            const { orderId, outOrderNo, errNo, errMsg, errLogId } = res
            if (errLogId) {
              console.log('预下单失败', errNo, errMsg, errLogId)
            }
            if (orderId || outOrderNo) {
              console.log('支付失败', errNo, errMsg, orderId, outOrderNo)
              // that.cancelOrder(outOrderNo)
            }
            console.log(errNo, errMsg)
            uni.hideLoading()
          },
        })
      } else {
        tt.createOrder({
          skuList: [
            {
              skuId: that.orderPayload.ttId,
              skuType: 1,
              quantity: 1,
              price: that.detail.price.totalPrice,
              goodsInfo: {
                goodsName: that.detail.items[0].spuName,
                goodsPhoto: that.detail.items[0].picUrl,
                goodsId: that.orderPayload.ttId,
                goodsType: 1,
              },
              discountAmount: that.activityInfo ? that.activityInfo.discountAmount : 0,
            },
          ],
          payment: {
            totalAmount: that.detail.price.totalPrice,
            totalDiscountAmount: that.activityInfo ? that.activityInfo.discountAmount : 0,
          },
          tradeOption: {
            life_trade_flag: 1,
          },
          discount_amount: that.activityInfo ? that.activityInfo.discountAmount : 0,
          total_amount: that.detail.price.totalPrice,
          discountInfo: that.activityInfo
            ? {
                type: 1,
                detail: {
                  orderDiscount: that.activityInfo.calculationResult.orderCalculationResultInfo,
                  goodsDiscount: that.activityInfo.calculationResult.goodsCalculationResultInfo,
                  itemDiscount: that.activityInfo.calculationResult.itemCalculationResultInfo,
                },
              }
            : undefined,
          success: res => {
            const { orderId, outOrderNo } = res
            console.log('success res', res)
            console.log('orderId', orderId, 'outOrderNo', outOrderNo)
            uni.redirectTo({
              url:
                '/pages/goods/reservation?data=' +
                encodeURIComponent(
                  JSON.stringify({
                    items: [
                      {
                        skuId: that.detail.items[0].skuId,
                        count: that.detail.items[0].count,
                        //  skuLength:100,
                        // skuWidth :100
                        // categoryId: that.detail.categoryId
                      },
                    ],
                    // TODO 芋艿：后续清理掉这 2 参数
                    deliveryType: 1,
                    pointStatus: false,
                    // ttId:this.detail.ttId,
                    id: outOrderNo,
                  })
                ),
            })
            // that.submitOrder(outOrderNo)
            uni.hideLoading()
          },
          fail: res => {
            const { orderId, outOrderNo, errNo, errMsg, errLogId } = res
            if (errLogId) {
              console.log('预下单失败', errNo, errMsg, errLogId)
            }
            if (orderId || outOrderNo) {
              console.log('支付失败', errNo, errMsg, orderId, outOrderNo)
              console.log('orderId', orderId)
              console.log('outOrderNo', outOrderNo)
              // that.cancelOrder(outOrderNo)
            }
            console.log(errNo, errMsg, 1111111)
            uni.hideLoading()
          },
        })
      }
    },
    cancelOrder(id) {
      let that = this
      that.$http
        .deleteRequest(`app-api/trade/order/cancel`, {
          id: id,
        })
        .then(res => {
          if (res.code == 0) {
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
    submitOrder(id) {
      let that = this
      that.$http
        .postRequest(`app-api/trade/order/ttOrderCommit`, {
          id: id,
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
    /**
     * 拨打电话
     */
    makePhone() {
      uni.makePhoneCall({
        phoneNumber: this.kfPhone,
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
  padding: 20rpx 30rpx;
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
  padding: 20rpx 30rpx;
}
.c-2 {
  padding: 20rpx;
  background-color: white;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
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
  padding: 20rpx 0;
  border-bottom: 1rpx solid $tn-border-solids-color;
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
  margin-top: 20rpx;
  display: flex;
  align-items: center;
}
.c-33 {
  color: $tn-font-sub1-color;
}
.c-34 {
  width: 560rpx;
  margin-left: 20rpx;
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
/* 间隔线 end*/
</style>
