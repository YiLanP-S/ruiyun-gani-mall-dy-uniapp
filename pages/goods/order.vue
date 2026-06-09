<template>
  <view class="order">
    <view class="order_t">
      <view class="order_tl">
        <image class="" :src="detail.picUrl" mode="aspectFit|aspectFill|widthFix" lazy-load="false" binderror="" bindload="" />
      </view>
      <view class="order_tr">
        <view class="order_trt">{{ detail.name }}</view>
        <view class="order_trc"> 全国通用 | 随时退</view>
        <view class="order_trb">
          <view class="order_trbl"
            >共 <text>{{ 1 }}</text> 张</view
          >
          <view class="order_trbr"
            ><view class="order_trbrl">￥</view><view class="order_trbrr">{{ detail.price ? $base.f2y(detail.price) : '--' }}</view></view
          >
        </view>
      </view>
    </view>

    <view class="priceBox">
      <view class="priceBox_t"> 费用明细 </view>
      <view class="priceBox_c">
        <view class="priceBox_cl">订单总价：</view>
        <view class="priceBox_cr">￥{{ detail.price ? $base.f2y(detail.price) : '--' }} </view>
      </view>
    </view>

    <view class="customerService">
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
      <view class="c-2" @click="makePhone" style="margin-bottom: 20rpx">
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

    <canvas id="canvas" type="2d" style="width: 100px; height: 100px"></canvas>

    <view class="order_b">
      <view class="order_bl">
        <view class="order_bll">￥</view><view class="order_blr">{{ detail.price ? $base.f2y(detail.price) : '--' }}</view></view
      >
      <block v-if="stock > 0">
        <!-- <button class="btn btn_act1" @click="go2Index">取消订单</button> -->
        <button v-if="isLogin" class="btn btn_act2" :class="buyShow ? 'btn_act2_act' : ''" @click="buy" :disabled="buyShow">支付订单</button>
        <button v-else class="btn btn_act2" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">支付订单</button>
      </block>
      <block v-else>
        <button class="btn btn_act1">已售罄</button>
      </block>
    </view>

    <tn-popup v-model="getMobilesShow" mode="center" :borderRadius="16" :maskCloseable="false">
      <view class="mobilesBox">
        <view class="mobilesBox_t">授权提示</view>
        <view class="mobilesBox_c">为方便施工服务联系，请授权您的手机号。</view>
        <view class="mobilesBox_b">
          <!-- <button class="btn btn_l" @click="getMobilesShow = false">取消</button> -->
          <button class="btn btn_r" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">授权</button>
        </view>
      </view>
    </tn-popup>

    <!-- <button class="tipsBox" open-type="lifeIm" style="border-radius: 0" /> -->

    <tn-tips ref="tips" position="center" style="z-index: 99999"></tn-tips>
  </view>
</template>

<script>
import store from '../../store/index.js'
export default {
  data() {
    return {
      id: null,
      detail: {},
      stock: null,
      skuId: null,
      isLogin: false,
      getMobilesShow: false,
      buyShow: false,

      serveList: [
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0013.png', title: '购买下单', explanation: '点击商品详情页“立即下单”按钮并支付订单' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0014.png', title: '预约上门', explanation: '找到自己的订单并填写上门地址、时间，施工场景照片等基础信息' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0015.png', title: '等待服务', explanation: '预约完成后，保持电话畅通，客服/师傅将第一时间与您联系确认订单信息' },
        { img: 'https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0016.png', title: '施工验收', explanation: '检查施工结果,如有问题立即与师傅/客服沟通' },
      ],

      area: 1,
      discountAmount: 0,
      orderDetail: {
        price: {
          payPrice: 0,
          totalPrice: 0,
        },
      },
      activityInfoNew: null,
      discountAmount: 0,
      orderPayload: '',
    }
  },
  onLoad(options) {
    console.log('id', options.id)
    this.id = options.id
    this.getDetail()
  },
  onShow() {
    this.isLogin = uni.getStorageSync('token') ? true : false
    uni.login({
      provider: 'toutiao',
      success: res => {
        let code = res.code
        console.log('微信授权登录wxlogin:', code)
      },
    })
  },

  methods: {
    // 返回首页
    go2Index() {
      uni.reLaunch({
        url: '/pages/index/index',
      })
    },
    /**
     * 拨打电话
     */
    makePhone() {
      uni.makePhoneCall({
        phoneNumber: this.kfPhone,
      })
    },
    //获取商品详情
    getDetail() {
      let that = this
      that.$http.getRequest('app-api/product/spu/get-detail', { id: that.id }).then(res => {
        if (res.code == 0) {
          console.log('获取商品详情', res.data)
          that.detail = res.data
          that.stock = res.data.skus.reduce((sum, v) => sum + v.stock, 0) || 0
          that.skuId = res.data.skus[0].id
          console.log('that.stock', that.stock)
          console.log(that.detail)
          tt.computePromotion({
            goodsMarketingInfo: [
              {
                goodsId: that.detail.ttId,
                quantity: 1,
                totalAmount: that.detail.price,
              },
            ],
            needDefaultMarketing: true, // 需要返回默认优惠
            success: res => {
              let discountAmount = 0
              if (res.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo.length > 0) {
                res.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo.forEach((item, idnex) => {
                  discountAmount += item.discountAmount
                })
                that.detail.price = res.calculationResult.goodsCalculationResultInfo[0].totalAmount - discountAmount
                that.detail.marketPrice = res.calculationResult.goodsCalculationResultInfo[0].totalAmount
                that.discountAmount = discountAmount
                console.log('that.discountAmount', that.discountAmount)
                that.activityInfoNew = res
              } else {
                that.activityInfo = null
                that.activityInfoNew = null
              }
            },
            fail: res => {
              console.log('fail res', res)
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
    },

    //下单
    buy() {
      console.log('开始下单')
      let that = this
      if (that.skuId <= 0) {
        that.$refs.tips.show({
          msg: '请选择规格',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      if (that.stock <= 0) {
        that.$refs.tips.show({
          msg: '库存不足',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      if (!that.area > 1) {
        that.$refs.tips.show({
          msg: '请填写，最小为1平方米',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }
      if (that.stock / 10000 < that.area) {
        that.$refs.tips.show({
          msg: '购买数量超过库存数',
          backgroundColor: '#E83A30',
          fontColor: '#FFFFFF',
          duration: 1500,
        })
        return
      }

      let data = {
        items: [
          {
            skuId: that.skuId,
            count: that.area * 10000,
            categoryId: that.detail.categoryId,
          },
        ],
        // TODO 芋艿：后续清理掉这 2 参数
        deliveryType: 1,
        pointStatus: false,
        ttId: that.detail.ttId,
        ttProductType: that.detail.ttProductType,
        activityInfo: that.activityInfo
          ? {
              activityId: that.activityInfo.id,
              activityPrice: that.detail.price,
              calculationResult: that.calculationResult,
              discountAmount: that.discountAmount,
            }
          : null,
      }
      console.log('data', data)
      that.showModal = true

      this.orderParameter = JSON.parse(JSON.stringify(data))
      this.orderPayload = JSON.parse(JSON.stringify(data))
      if (this.orderParameter.activityInfo) {
        this.activityInfoNew = this.orderParameter.activityInfo
      }
      delete this.orderParameter.activityInfo
      delete this.orderPayload.activityInfo
      console.log('this.orderPayload', this.orderPayload)
      delete this.orderParameter.items
      for (let i = 0; i < this.orderPayload.items.length; i++) {
        this.orderParameter[encodeURIComponent('items[' + i + '' + '].skuId')] = this.orderPayload.items[i].skuId + ''
        this.orderParameter[encodeURIComponent('items[' + i + '' + '].count')] = this.orderPayload.items[i].count + ''
        if (this.orderPayload.items[i].cartId) {
          this.orderParameter[encodeURIComponent('items[' + i + '' + '].cartId')] = this.orderPayload.items[i].cartId + ''
        }
      }
      console.log('3333', this.orderParameter)
      let queryString = Object.keys(this.orderParameter)
        .map(key => key + '=' + this.orderParameter[key])
        .join('&')
      console.log('数据', queryString)
      that.getOrderInfo(queryString)
    },

    // 更新用户信息
    onGetphonenumber(e) {
      console.log('e------', e)
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        this.getMobilesShow = false
        uni.login({
          provider: 'toutiao',
          success: res => {
            let code = res.code
            console.log('微信授权登录wxlogin:', code)
            console.log('微信授权登录e:', e)
            this.$http
              .postRequest('app-api/member/auth/douyin-mini-app-login', {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                loginCode: code,
                state: 'default',
              })
              .then(res => {
                if (res.code == 0) {
                  console.log('mobile', res.data.mobile)
                  uni.setStorageSync('token', res.data.accessToken)
                  uni.setStorageSync('mobile', res.data.mobile)
                  uni.setStorageSync('openid', res.data.openid)
                  uni.setStorageSync('userId', res.data.userId)
                  uni.setStorageSync('isDistributor', res.data.isDistributor)
                  this.isLogin = true
                  this.buy()
                  // 更新购物车
                  this.$http.getRequest('app-api/trade/cart/list').then(res => {
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
                } else {
                  this.$refs.tips.show({
                    msg: res.msg,
                    backgroundColor: '#E83A30',
                    fontColor: '#FFFFFF',
                    duration: 1500,
                  })
                }
              })
              .catch(res => {})
          },
        })
      } else {
        if (e.detail.errMsg === 'getPhoneNumber:fail Internal error: phoneArray is empty' || e.detail.errMsg === 'getPhoneNumber:fail Internal error:') {
          this.$refs.tips.show({
            msg: '请切换抖音账号，使用个人抖音账号下单',
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 2000,
          })
        } else {
          this.getMobilesShow = true
        }
      }
      // 判断是否已经选择了用户头像和输入了用户昵称
      // console.log('this.userInfo',this.userInfo)
      // console.log('e',e)
      //     if (!this.userInfo.avatar || !this.userInfo.nickname) {
      // this.$refs.tips.show({
      //   msg: '请选择头像和输入用户信息',
      //   backgroundColor: '#E83A30',
      //   fontColor: '#FFFFFF',
      //   duration: 1500
      // })
      // return
      //     }

      // if(!this.isAgree){
      // 	this.tipsMessage = '请先阅读协议'
      // 	this.tipsShow = true
      // 	setTimeout(()=>{
      // 		this.tipsShow = false
      // 	},1500)
      // 	return
      // }
    },

    getOrderInfo(queryString) {
      let that = this
      that.$http.getRequest(`app-api/trade/order/settlement?${queryString}`).then(res => {
        console.log('res11', res)
        if (res.code == 0) {
          that.orderDetail = res.data
          this.reservationDy()
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

    // 创建订单&跳转
    reservationDy() {
      let that = this
      uni.showLoading({
        title: '支付请求中...',
      })
      that.buyShow = true
      console.log('调起时间', new Date())
      console.log('this.orderPayload.ttProductType', that.orderPayload.ttProductType)
      console.log('this.orderPayload.ttId', that.orderPayload.ttId)
      // console.log('that.activityInfo.calculationResult.orderCalculationResultInfo',that.activityInfo.calculationResult.orderCalculationResultInfo)
      console.log('that.activityInfoNew', that.activityInfoNew)
      console.log('that.discountAmount', that.discountAmount)

      that.activityInfoNew = JSON.parse(JSON.stringify(that.activityInfoNew))
      if (that.activityInfoNew) {
        that.activityInfoNew.calculationResult.orderCalculationResultInfo.marketingInfo = that.activityInfoNew.calculationResult.orderCalculationResultInfo.marketingDetailInfo
        delete that.activityInfoNew.calculationResult.orderCalculationResultInfo.marketingDetailInfo
        that.activityInfoNew.calculationResult.goodsCalculationResultInfo[0].marketingInfo = that.activityInfoNew.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo
        delete that.activityInfoNew.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo
        that.activityInfoNew.calculationResult.itemCalculationResultInfo[0].marketingInfo = that.activityInfoNew.calculationResult.itemCalculationResultInfo[0].marketingDetailInfo
        delete that.activityInfoNew.calculationResult.itemCalculationResultInfo[0].marketingDetailInfo
      }
      console.log('that.activityInfoNew111', that.activityInfoNew)
      // return false
      if (that.orderPayload.ttProductType != 22) {
        console.log(333)
        tt.createOrder({
          goodsList: [
            {
              quantity: 1, // 购买数量 必填
              price: that.orderDetail.price.totalPrice, // 商品价格 必填
              goodsName: that.orderDetail.items[0].spuName, // 商品名称 必填
              goodsPhoto: that.orderDetail.items[0].picUrl, // 商品图片链接 必填
              goodsId: that.orderPayload.ttId, // 商品ID 必填
              goodsType: 1, // 商品类型 必填
              // goodsLabels: ["不可退"], // 商品标签 非必填
              dateRule: '', // 使用规则 非必填
              discountAmount: that.activityInfoNew ? that.discountAmount : 0,
            },
          ],
          payment: {
            totalAmount: that.orderDetail.price.totalPrice, // 订单总价 必填
            totalDiscountAmount: that.activityInfoNew ? that.discountAmount : 0,
          },
          discount_amount: that.activityInfoNew ? that.discountAmount : 0,
          total_amount: that.orderDetail.price.totalPrice,
          discountInfo: that.activityInfoNew
            ? {
                type: 1,
                detail: {
                  orderDiscount: that.activityInfoNew.calculationResult.orderCalculationResultInfo,
                  goodsDiscount: that.activityInfoNew.calculationResult.goodsCalculationResultInfo,
                  itemDiscount: that.activityInfoNew.calculationResult.itemCalculationResultInfo,
                },
              }
            : undefined,
          success: res => {
            that.showModal = false
            const { orderId, outOrderNo } = res
            console.log('预下单成功', res)
            console.log('success res1111', res)
            console.log('orderId', orderId, 'outOrderNo', outOrderNo)
            uni.redirectTo({
              url:
                '/pages/goods/reservation?data=' +
                encodeURIComponent(
                  JSON.stringify({
                    items: [
                      {
                        skuId: that.orderDetail.items[0].skuId,
                        count: that.orderDetail.items[0].count,
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
            that.buyShow = false
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
            that.getDetail()
            that.showModal = false
            if (errNo != 4) {
              console.log('报错了', res)
              that.$refs.tips.show({
                msg: errMsg,
                backgroundColor: '#E83A30',
                fontColor: '#FFFFFF',
                duration: 1500,
              })
            }
            console.log(errNo, errMsg)
            uni.hideLoading()
            that.buyShow = false
          },
        })
      } else {
        console.log(444, that.orderDetail)
        let obj = {
          skuList: [
            {
              skuId: that.orderPayload.ttId,
              skuType: 1,
              quantity: 1,
              price: that.orderDetail.price.totalPrice,
              goodsInfo: {
                goodsName: that.orderDetail.items[0].spuName,
                goodsPhoto: that.orderDetail.items[0].picUrl,
                goodsId: that.orderPayload.ttId,
                goodsType: 1,
              },
              discountAmount: that.activityInfoNew ? that.discountAmount : 0,
            },
          ],
          payment: {
            totalAmount: that.orderDetail.price.totalPrice,
            totalDiscountAmount: that.activityInfoNew ? that.discountAmount : 0,
          },
          tradeOption: {
            life_trade_flag: 1,
          },
          discount_amount: that.activityInfoNew ? that.discountAmount : 0,
          total_amount: that.orderDetail.price.totalPrice,
          discountInfo: that.activityInfoNew
            ? {
                type: 1,
                detail: {
                  orderDiscount: that.activityInfoNew.calculationResult.orderCalculationResultInfo,
                  goodsDiscount: that.activityInfoNew.calculationResult.goodsCalculationResultInfo,
                  itemDiscount: that.activityInfoNew.calculationResult.itemCalculationResultInfo,
                },
              }
            : undefined,
        }
        console.log('obj', obj)
        tt.createOrder({
          skuList: [
            {
              skuId: that.orderPayload.ttId,
              skuType: 1,
              quantity: 1,
              price: that.orderDetail.price.totalPrice,
              goodsInfo: {
                goodsName: that.orderDetail.items[0].spuName,
                goodsPhoto: that.orderDetail.items[0].picUrl,
                goodsId: that.orderPayload.ttId,
                goodsType: 1,
              },
              discountAmount: that.activityInfoNew ? that.discountAmount : 0,
            },
          ],
          payment: {
            totalAmount: that.orderDetail.price.totalPrice,
            totalDiscountAmount: that.activityInfoNew ? that.discountAmount : 0,
          },
          tradeOption: {
            life_trade_flag: 1,
          },
          discount_amount: that.activityInfoNew ? that.discountAmount : 0,
          total_amount: that.orderDetail.price.totalPrice,
          discountInfo: that.activityInfoNew
            ? {
                type: 1,
                detail: {
                  orderDiscount: that.activityInfoNew.calculationResult.orderCalculationResultInfo,
                  goodsDiscount: that.activityInfoNew.calculationResult.goodsCalculationResultInfo,
                  itemDiscount: that.activityInfoNew.calculationResult.itemCalculationResultInfo,
                },
              }
            : undefined,
          success: res => {
            that.showModal = false
            const { orderId, outOrderNo } = res
            console.log('success res1111', res)
            console.log('orderId', orderId, 'outOrderNo', outOrderNo)
            uni.redirectTo({
              url:
                '/pages/goods/reservation?data=' +
                encodeURIComponent(
                  JSON.stringify({
                    items: [
                      {
                        skuId: that.orderDetail.items[0].skuId,
                        count: that.orderDetail.items[0].count,
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
            that.buyShow = false
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
            that.getDetail()
            that.showModal = false
            if (errNo != 4) {
              console.log('报错了', res)
              that.$refs.tips.show({
                msg: errMsg,
                backgroundColor: '#E83A30',
                fontColor: '#FFFFFF',
                duration: 1500,
              })
            }
            console.log(errNo, errMsg, 1111111)
            uni.hideLoading()
            that.buyShow = false
          },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.order {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;
  padding: 30rpx;
  overflow-y: scroll;
  box-sizing: border-box;
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
          align-items: baseline;
          height: 36rpx;
          .order_trbrl {
            font-size: 20rpx;
            color: #0059ff;
            // padding-top: 14rpx;
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
        margin-left: auto;
        font-size: 28rpx;

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
  .order_b {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 28rpx;
    padding-top: 16rpx;
    display: flex;
    // height: 156rpx;
    padding-bottom: 52rpx;
    background-color: #fff;
    box-sizing: border-box;
    .order_bl {
      margin-top: 24rpx;
      flex: 1;
      height: 36rpx;
      display: flex;
      align-items: baseline;
      .order_bll {
        height: 36rpx;
        font-size: 24rpx;
        color: $tn-theme-color;
        // padding-top: 14rpx;
        margin-right: 6rpx;
        box-sizing: border-box;
      }
      .order_blr {
        height: 36rpx;
        font-size: 36rpx;
        font-weight: 600;
        color: $tn-theme-color;
      }
    }
    .btn {
      width: 240rpx;
      height: 88rpx;
      border-radius: 44rpx;
      color: $tn-bg-color;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 16rpx;
    }
    .btn_act1 {
      color: $my-font-sub-color;
      background: $tn-bg-color;
      border: 2rpx solid $my-bd-color;
    }
    .btn_act2 {
      background: $tn-bg-color;
      // background: linear-gradient(90deg, $tn-theme-colo 0%, $my-theme-color 100%);
      background: linear-gradient(90deg, #0059ff 0%, #4284ff 100%);
    }
    .btn_act2_act {
      background: $my-font-sub-color;
    }
  }

  //授权手机号的获取弹框
  .mobilesBox {
    width: 680rpx;
    height: 100%;
    padding: 30rpx 50rpx;
    box-sizing: border-box;
    .mobilesBox_t {
      width: 100%;
      height: 80rpx;
      font-size: 40rpx;
      font-weight: 600;
      color: $tn-theme-color;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20rpx;
    }
    .mobilesBox_c {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 40rpx;
      text-align: center;
    }
    .mobilesBox_b {
      display: flex;
      justify-content: space-around;
      .btn {
        width: 360rpx;
        height: 70rpx;
        border-radius: 36rpx;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .btn_l {
        border: 2rpx solid #999;
        color: #999;
      }
      .btn_r {
        background: $tn-theme-color;
        color: $tn-bg-color;
      }
    }
  }
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

.customerService {
  width: 100%;
  padding: 0 20rpx;
  background-color: white;
  border-radius: 8rpx;
}

.c-2 {
  padding: 20rpx 0;
  background-color: white;
}

.c-85 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 0;
  border-radius: 16rpx;
  margin: 0;
  line-height: initial;
  font-size: 28rpx;
  width: 100%;
}
.c-86 {
  display: flex;
  align-items: center;
}
</style>
