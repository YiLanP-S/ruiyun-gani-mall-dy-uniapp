<template>
  <view class="template-product tn-safe-area-inset-bottom">
    <swiper class="card-swiper" :circular="true" :autoplay="true" duration="500" interval="5000" @change="cardSwiper">
      <swiper-item v-for="(item, index) in detail.sliderPicUrls" :key="index" :class="cardCur == index ? 'cur' : ''">
        <view class="swiper-item image-banner" @click="tn">
          <image :src="item" mode="aspectFill"></image>
        </view>
      </swiper-item>
    </swiper>
    <view class="indication">
      <block v-for="(item, index) in detail.sliderPicUrls" :key="index">
        <view class="spot" :class="cardCur == index ? 'active' : ''"></view>
      </block>
    </view>

    <!-- <view class="b-1">
      <view>
        <text>{{ activityInfo.type == 1 ? '秒杀' : '' }}</text>
        <view class="b-2">
          <text class="b-3">￥</text><text class="b-4">{{ parseFloat((detail.price / 100).toFixed(2)) }}</text
          ><text class="b-5"></text>
          <view class="b-46" v-if="activityInfo">
            <view class="b-47">原价：</view>
            <view class="b-48">￥{{ parseFloat((detail.marketPrice / 100).toFixed(2)) }}</view>
          </view>
        </view>
      </view>
      <view class="b-6-box">
        <view class="b-6">已售 {{ formatNum(detail.salesCount) }}</view>
        <view class="b-6" v-if="activityInfo" style="margin-top: 30rpx">
          距离秒杀结束：<tn-count-down :timestamp="countdownSeconds" fontColor="white" separatorColor="white" :fontSize="24" backgroundColor="#6a95e8" :showDays="true" :showHours="true" @end="getDetail"></tn-count-down>
        </view>
      </view>
    </view> -->
    <view class="goodTitle">
      <view class="goodTitle_t">
        <!-- <view class="goodTitle_tl"
          ><text>￥</text><text>{{ parseFloat((detail.price / 100).toFixed(2)) }}</text></view
        > -->
        <!-- <view class="pricTips" :class="discountAmount > 0 ? 'pricTips_act' : ''">{{ discountAmount > 0 ? '券后价' : '优惠价' }}</view> -->
        <view class="goodTitle_tl">
          <text>￥</text><text>{{ $base.f2yFront(detail.price) }}</text
          ><text>{{ $base.f2yBack(detail.price) }}</text>
        </view>

        <view class="pricTips" v-if="discountAmount > 0">
          <view class="pricTips_c">
            <text>券后</text><text>￥</text><text>{{ $base.f2yFront(detail.price1) }}</text
            ><text>{{ $base.f2yBack(detail.price1) }}</text>
          </view>
        </view>

        <view class="goodTitle_tc">￥{{ $base.f2y(detail.marketPrice, 0) }}</view>
        <view class="original_price"
          ><text class="soldBox">已售</text><text class="num">{{ formatNum(detail.salesCount) }}</text></view
        >
      </view>
      <!-- <view class="discount_tips">比日常团购低{{ $base.f2y(discountAmount) }}元</view> -->
      <view class="goodTitle_c">{{ detail.name }}</view>
      <view class="goodTitle_b">全国通用 | 随时退 | 一口价</view>
    </view>
    <!-- <view class="b-37">
      <view class="b-38">{{ detail.name }}</view>
      <view class="b-39"
        ><text>{{ detail.introduction }}</text></view
      >
    </view> -->
    <!-- 边距间隔 -->
    <!-- <view class="tn-strip-bottom"></view> -->
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
    <view class="tn-strip-bottom"></view>
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
    <view class="tn-strip-bottom"></view>

    <!-- 购买须知 -->
    <view class="Instructions" v-if="detail.introduction">
      <view class="title">购买须知</view>
      <text class="content" :class="hidTextShow ? '' : 'content_act'">{{ detail.introduction }}</text>
      <view class="border_box"></view>
      <view class="food" @click="hidTextShow = !hidTextShow">{{ hidTextShow ? '收起' : '了解更多' }}</view>
    </view>

    <!-- 更多信息-->
    <view class="tn-padding-top-sm tn-padding-bottom-sm b-12-box">
      <view class="b-19">
        <view class="b-20">用户评价({{ formatNum1(total) }})</view>
        <view class="b-21" @click="tn('/pages/goods/comment/list?spuId=' + id)">
          <view class="b-22">全部评价</view>
          <text class="tn-icon-right"></text>
        </view>
      </view>
      <view class="b-23" v-if="commentList.length > 0">
        <block v-for="(item, index) in commentList" :key="index">
          <view class="b-24" v-if="index < 1">
            <!-- <view class="b-24"> -->
            <view class="b-25">
              <image class="b-26" :src="item.userAvatar ? item.userAvatar : '/static/tx_img.png'"></image>
            </view>
            <view class="b-27">
              <view class="b-28">
                <view class="b-29">
                  <view class="b-30-box">
                    <view class="b-30">{{ item.userNickname ? item.userNickname : '匿名用户' }}</view>
                    <tn-rate v-model="item.scores" inactiveIcon="star-fill" activeColor="#ffca3e" :count="5" :size="24" :disabled="true"></tn-rate>
                  </view>
                  <view class="b-31">{{ timestampToTime(item.createTime) }}</view>
                </view>
              </view>
              <view class="b-34">{{ item.content }}</view>
              <view class="b-35">
                <image class="b-36" v-for="(item1, index1) in item.picUrls" :key="index1" :src="item1" @click="previewImageList(item1, item.picUrls)"></image>
              </view>
              <view class="b-43" v-if="item.replyTime">
                <view class="b-44">商家回复：</view>
                <view class="b-45">{{ item.replyContent }}</view>
              </view>
            </view>
          </view>
        </block>
      </view>
      <view v-else class="wu">
        <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
      </view>
    </view>

    <!-- 边距间隔 -->
    <view class="tn-strip-bottom"></view>

    <!-- <view class="tn-margin-top-sm">
      <view class="nav_title--wrap">
        <view class="nav_title tn-cool-bg-color-6">
          <text class="tn-icon-star tn-padding-right-sm tn-text-xxl"></text>
          <text class="tn-text-xl">简一科技 · 产品详情</text>
          <text class="tn-icon-star tn-padding-left-sm tn-text-xxl"></text>
        </view>
      </view>
    </view> -->

    <view class="content-backgroup tn-margin">
      <view class="title">图文详情</view>
      <mp-html :content="detail.description" />
    </view>

    <!-- <view id="top-info" class="tn-footerfixed tn-safe-area-inset-bottom tn-bg-white" :style="{ transform: `translateY(${topInfoTranslateY}px)` }">
      <view class="tn-flex tn-flex-row-between tn-flex-col-center">
        <view class="tn-flex-4 justify-content-item tn-padding-top-sm tn-padding-bottom-sm" style="display: flex; justify-content: center" v-if="stock > 0">
          <button class="payBtn" @click="buy">立即{{ activityInfo ? '抢购' : '下单' }}</button>
        </view>
        <view class="tn-flex-4 justify-content-item tn-padding-top-sm tn-padding-bottom-sm" v-else style="display: flex; justify-content: center">
          <button class="payBtn disBtn" :disabled="true">已售罄</button>
        </view>
      </view>
    </view> -->

    <!-- 底部 -->
    <view class="foodBox">
      <button class="foodBox_l" open-type="lifeIm"><view class="foodBox_ll"></view> 客服</button>
      <view class="foodBox_r">
        <button v-if="stock > 0" class="payBtn" @click="buy">立即{{ activityInfo ? '抢购' : '下单' }}</button>
        <button v-else class="payBtn disBtn" :disabled="true">已售罄</button>
      </view>
    </view>

    <!-- 选择弹框 -->
    <!-- popup会有延迟，采用这种方式来优化弹窗的优化体验-->
    <sku-modal v-model="showSkuModal"></sku-modal>
    <tuniaoui-wx-user-info v-model="loginShow" @updated="updatedUserInfoEvent"></tuniaoui-wx-user-info>
    <view class="tn-tabbar-height"></view>
    <tn-tips ref="tips" position="center" style="z-index: 99999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
    <!-- 确认订单弹框 -->
    <tn-popup v-model="showModal" mode="bottom" closeBtn="true" borderRadius="16" height="70%" closeBtnIcon="close-fill">
      <view class="c-56">
        <view class="c-57">订单确认</view>
        <scroll-view :scroll-y="true" class="content_auto" :style="{ height: vuex_is_black_stripe ? 'calc(100% - 20px - 101rpx - 120rpx)' : 'calc(100% - 101rpx - 120rpx)' }">
          <view style="padding-bottom: 30rpx">
            <view class="c-2" v-for="(item, index) in orderDetail.items" :key="index">
              <view class="c-15">
                <image class="c-16" :src="item.picUrl"></image>
                <view class="c-17">
                  <view class="c-18">{{ item.spuName }}</view>
                  <view class="c-19-box">
                    <view class="c-19" v-for="(item1, index1) in item.properties" :key="index1">{{ item1.propertyName + ':' + item1.valueName }}<text>/</text></view>
                  </view>
                  <view class="c-20">
                    <view class="c-21"
                      ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((activityInfoNew ? (orderDetail.price.totalPrice - discountAmount) / 100 : item.price / 100).toFixed(2)) }}</text></view
                    >
                  </view>
                </view>
              </view>
            </view>
            <view class="c-2">
              <view class="c-25">费用明细</view>
              <view class="c-26-box">
                <view class="c-26" style="margin-bottom: 0">
                  <view class="c-27">团购价格</view>
                  <view class="c-28">￥{{ parseFloat((activityInfoNew ? (orderDetail.price.totalPrice - discountAmount) / 100 : orderDetail.price.totalPrice / 100).toFixed(2)) }}</view>
                </view>
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
          </view>
        </scroll-view>

        <view class="c-65">
          <view class="c-69" style="width: 100%">
            <tn-button class="tn-button" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="onConfirm">
              <text class="">提交订单</text>
            </tn-button>
          </view>
        </view>
      </view>
    </tn-popup>

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
  </view>
</template>

<script>
import SkuModal from '@/components/sku/sku.vue'
import tuniaouiWxUserInfo from '@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue'
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import { timestampToTime } from '@/util/util.js'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue'
import store from '../../store/index.js'
export default {
  components: { SkuModal, mpHtml, tuniaouiWxUserInfo },
  name: 'TemplateProduct',
  mixins: [template_page_mixin],
  data() {
    return {
      /* 选择弹窗*/
      showSkuModal: false,
      getMobilesShow: false, //获取手机号提醒弹框
      hidTextShow: false, //控制文字隐藏显示

      cardCur: 0,
      countOptions: [
        {
          icon: 'star',
          text: '收藏',
        },
        {
          icon: 'share-circle',
          text: '分享',
        },
      ],
      customButtonGroups: [
        {
          text: '咨询客服',
          backgroundColor: 'tn-cool-bg-color-5',
          color: '#FFFFFF',
        },
        {
          text: '立即购买',
          backgroundColor: 'tn-cool-bg-color-15--reverse',
          color: '#FFFFFF',
        },
      ],

      topInfo: {
        height: 0,
      },
      topInfoTranslateY: 0,
      prevScrollTop: 0,
      typesList: [{ name: '产品详情' }, { name: '服务内容' }, { name: '收费标准' }],
      current: 0,

      id: '',
      detail: '',
      initArea: 1,
      area: 1,
      commentList: [],
      total: 0,
      timestampToTime,
      stock: 0,
      skuId: 0,
      activityInfo: null,
      calculationResult: null,
      countdownSeconds: 0,
      discountAmount: 0,
      isLogin: false,

      showModal: false,
      orderParameter: '',
      orderPayload: '',
      orderDetail: {
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
      activityInfoNew: null,
    }
  },
  onReady() {
    this.getTopInfoRect()
  },
  onShow() {
    // uni.removeStorageSync('token')
    this.isLogin = uni.getStorageSync('token') ? true : false

    uni.login({
      provider: 'toutiao',
      success: res => {
        let code = res.code
        console.log('微信授权登录wxlogin:', code)
      },
    })
  },
  onPageScroll(e) {
    this.handlePageScroll(e.scrollTop)
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
    if (options.id) {
      this.id = options.id
      this.getDetail()
      this.getComment()
    }
  },

  methods: {
    // 跳转
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
    // 获取商品详情
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
          // that.detail.price1 = this.$Big(that.detail.price).div(100, 2).toFixed(2)
          // that.detail.marketPrice1 = this.$Big(that.detail.marketPrice).div(100, 2).toFixed(2)

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
              console.log('success res222', res)

              let discountAmount = 0
              if (res.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo.length > 0) {
                res.calculationResult.goodsCalculationResultInfo[0].marketingDetailInfo.forEach((item, idnex) => {
                  discountAmount += item.discountAmount
                })
                that.detail.price1 = res.calculationResult.goodsCalculationResultInfo[0].totalAmount - discountAmount
                // that.detail.marketPrice = res.calculationResult.goodsCalculationResultInfo[0].totalAmount
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
    getComment() {
      let that = this
      that.$http
        .getRequest('app-api/product/comment/page', {
          spuId: that.id,
          pageNo: 1,
          pageSize: 3,
          type: 0,
        })
        .then(res => {
          if (res.code == 0) {
            that.commentList = res.data.list
            that.total = res.data.total
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
    // 预览图片
    previewProductImage() {
      wx.previewImage({
        urls: [
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
          'https://resource.tuniaokj.com/images/uniapp_market/1.jpg',
        ],
      })
    },

    // 打开选择弹框
    openSkuModal() {
      this.showSkuModal = true
    },

    // cardSwiper
    cardSwiper(e) {
      this.cardCur = e.detail.current
    },
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },

    // 获取顶部销售信息容器相关信息
    getTopInfoRect() {
      this._tGetRect('#top-info').then(res => {
        if (!res) {
          setTimeout(() => {
            this.getTopInfoRect()
          }, 50)
          return
        }
        this.topInfo.height = res.height
      })
    },
    // 处理页面滚动事件
    handlePageScroll(scrollTop) {},

    change(index) {
      this.current = index
    },
    formatNum(num) {
      // 情况二：小于等于 10
      if (num < 10) {
        return `≤10`
      }
      if (num >= 10000 && num < 100000) {
        return `1w+`
      }
      if (num >= 100000) {
        return `10w+`
      }
      return num
    },
    formatNum1(num) {
      // 情况二：小于等于 10
      // if (num < 10) {
      //   return `≤10`;
      // }
      if (num >= 10000 && num < 100000) {
        return `1w+`
      }
      if (num >= 100000) {
        return `10w+`
      }
      return num
    },
    previewImageList(url, urls) {
      let that = this
      uni.previewImage({
        current: url, // 当前显示图片的http链接
        urls: urls, // 需要预览的图片http链接列表
      })
    },
    inputBlur(e) {},
    // inputChange(e) {
    //   // console.log('e',e)
    //   this.area = e.value * 1
    //   // this.initArea = e.value*1
    // },
    buy() {
      uni.navigateTo({
        url: '/pages/goods/order?id=' + this.id,
        fail() {},
      })
      return
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
    getOrderInfo(queryString) {
      let that = this
      that.$http.getRequest(`app-api/trade/order/settlement?${queryString}`).then(res => {
        console.log('res', res)
        if (res.code == 0) {
          that.orderDetail = res.data
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
    // 提交订单
    onConfirm() {
      console.log('this.areaImages', this.areaImages)
      console.log('this.areaToolImages', this.areaToolImages)

      this.reservationDy()
    },
    // 创建订单&跳转
    reservationDy() {
      let that = this
      uni.showLoading({
        title: '支付请求中...',
      })
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
          },
        })
      } else {
        console.log(444)
        console.log(444, that.orderDetail)
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
          },
        })
      }
    },
    addCart() {
      if (!uni.getStorageSync('token')) {
        store.commit('$tStore', {
          name: 'loginShow',
          value: true,
        })
        return
      }
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
      that.$http
        .postRequest('app-api/trade/cart/add', {
          skuId: that.skuId,
          count: that.area * 10000,
          skuLength: 100,
          skuWidth: 100,
        })
        .then(res => {
          if (res.code == 0) {
            that.$refs.toast.show({
              title: '添加成功',
              icon: 'success',
              image: '',
              duration: 1000,
            })
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
          } else if (res.code == 401) {
            store.commit('$tStore', {
              name: 'loginShow',
              value: true,
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
    // 获取到的用户信息
    updatedUserInfoEvent(info) {
      console.log('获取到的用户信息', info)
      let that = this
      that.$http.putNewRequest('app-api/member/user/update', info).then(res => {
        if (res.code == 0) {
          store.commit('$tStore', {
            name: 'loginShow',
            value: false,
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
    /**
     * 拨打电话
     */
    makePhone() {
      uni.makePhoneCall({
        phoneNumber: this.kfPhone,
      })
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
        this.getMobilesShow = true
      }
    },

    // 跳转
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
.wu {
  padding-top: 50rpx;
}
.template-product {
  position: relative;
  width: 100%;
  height: 100%;
}
.tn-tabbar-height {
  min-height: 20rpx;
  height: calc(40rpx + env(safe-area-inset-bottom) / 2);
}

/* 用户头像 start */
.logo-image {
  width: 110rpx;
  height: 110rpx;
  position: relative;
}

.logo-pic {
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: top;
  box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 10rpx;
  overflow: hidden;
  // background-color: #FFFFFF;
}

/* 胶囊*/
.tn-custom-nav-bar__back {
  width: 100%;
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

  &:before {
    content: ' ';
    width: 1rpx;
    height: 110%;
    position: absolute;
    top: 22.5%;
    left: 0;
    right: 0;
    margin: auto;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    opacity: 0.7;
    background-color: #ffffff;
  }
}

/* 轮播视觉差 start */
.card-swiper {
  height: 750rpx !important;
}

.card-swiper swiper-item {
  width: 750rpx !important;
  left: 0rpx;
  box-sizing: border-box;
  // padding: 0rpx 30rpx 90rpx 30rpx;
  overflow: initial;
}

.card-swiper swiper-item .swiper-item {
  width: 100%;
  display: block;
  height: 100%;
  transform: scale(1);
  transition: all 0.2s ease-in 0s;
  overflow: hidden;
}

.card-swiper swiper-item.cur .swiper-item {
  transform: none;
  transition: all 0.2s ease-in 0s;
}

.image-banner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-banner image {
  width: 100%;
  height: 100%;
}

/* 轮播指示点 start*/
.indication {
  z-index: 9999;
  width: 100%;
  height: 36rpx;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.spot {
  background-color: #ffffff;
  opacity: 0.6;
  width: 10rpx;
  height: 10rpx;
  border-radius: 20rpx;
  top: -60rpx;
  margin: 0 8rpx !important;
  position: relative;
}

.spot.active {
  opacity: 1;
  width: 30rpx;
  background-color: #ffffff;
}

/* 间隔线 start*/
.tn-strip-bottom-min {
  width: 100%;
  border-bottom: 1rpx solid #f8f9fb;
}

/* 间隔线 start*/
.tn-strip-bottom {
  width: 100%;
  border-bottom: 20rpx solid #f5f7fc;
}
/* 间隔线 end*/
/* 标题 start */
.nav_title {
  -webkit-background-clip: text;
  color: transparent;

  &--wrap {
    position: relative;
    display: flex;
    height: 120rpx;
    font-size: 46rpx;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background-image: url(https://resource.tuniaokj.com/images/title_bg/title44.png);
    background-size: cover;
  }
}
/* 标题 end */

/* 用户头像 start */
.user-image {
  width: 90rpx;
  height: 90rpx;
  position: relative;
}

.user-pic {
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: top;
  border-radius: 50%;
  overflow: hidden;
  background-color: #ffffff;
}

/* 底部*/
.tn-footerfixed {
  position: fixed;
  width: 100%;
  height: 156rpx;
  padding-top: 16rpx;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
  bottom: 0;
  width: 100%;
  transition: all 0.25s ease-out;
  will-change: transform;
  z-index: 100;
  box-sizing: border-box;
}

/* 底部 start*/
.footerfixed {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 999;
  box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
}

/* 标签内容 start*/
.tn-tag-content {
  &__item {
    display: inline-block;
    line-height: 45rpx;
    padding: 10rpx 30rpx;
    margin: 20rpx 20rpx 5rpx 0rpx;

    &--prefix {
      padding-right: 10rpx;
    }
  }
}
/* 标签内容 end*/

/* 内容图 start */
.content-backgroup {
  z-index: -1;
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: $tn-font-title-color;
  }

  .backgroud-image {
    width: 100%;
  }
}

/* 内容图 end */

/* 商家商品 start*/
.tn-blogger-content {
  &__wrap {
    box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
    border-radius: 20rpx;
    margin: 15rpx;
  }

  &__info {
    &__btn {
      margin-right: -12rpx;
      opacity: 0.5;
    }
  }

  &__label {
    &__item {
      line-height: 45rpx;
      padding: 0 10rpx;
      margin: 5rpx 18rpx 0 0;

      &--prefix {
        color: #e83a30;
        padding-right: 10rpx;
      }
    }

    &__desc {
      line-height: 35rpx;
    }
  }

  &__main-image {
    border-radius: 16rpx 16rpx 0 0;

    &--1 {
      max-width: 690rpx;
      min-width: 690rpx;
      max-height: 400rpx;
      min-height: 400rpx;
    }

    &--2 {
      max-width: 260rpx;
      max-height: 260rpx;
    }

    &--3 {
      height: 212rpx;
      width: 100%;
    }
  }

  &__count-icon {
    font-size: 24rpx;
    padding-right: 5rpx;
  }
}
.image-good {
  width: 180rpx;
  height: 300rpx;
  position: relative;
}
.image-pic {
  border: 1rpx solid #f8f7f8;
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: center;
  border-radius: 20rpx;
}

.image-book {
  padding: 150rpx 0rpx;
  font-size: 16rpx;
  font-weight: 300;
  position: relative;
}
.image-picbook {
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: top;
  border-radius: 15rpx 15rpx 0 0;
}

/* 按钮 */
.button-1 {
  background-color: rgba(0, 0, 0, 0.15);
  position: absolute;
  /* bottom:200rpx;
      right: 20rpx; */
  top: 700rpx;
  right: 30rpx;
  z-index: 1001;
  border-radius: 100px;
}

/* 图标容器15 start */
.icon15 {
  &__item {
    width: 30%;

    // border-radius: 10rpx;
    padding: 30rpx;
    margin: 20rpx 10rpx;
    transform: scale(1);
    transition: transform 0.3s linear;
    transform-origin: center center;

    &--icon {
      width: 100rpx;
      height: 100rpx;
      font-size: 60rpx;
      border-radius: 50%;
      margin-bottom: 18rpx;
      z-index: 1;

      &::after {
        content: ' ';
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: 0;
        border-radius: inherit;
        opacity: 1;
        transform: scale(1, 1);
        background-size: 100% 100%;
      }
    }
  }
}

.b-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: $tn-theme-color;
  color: white;
}
.b-2 {
  font-size: 24rpx;
  display: flex;
  align-items: flex-end;
}
.b-4 {
  font-size: 56rpx;
  font-weight: bold;
  position: relative;
  top: 10rpx;
}
.b-6-box {
  // display: flex;
  // align-items: center;
  text-align: right;
}
.b-6 {
  font-size: 24rpx;
  padding: 0 15rpx;
  position: relative;
}
.b-6 ::v-deep  .tn-countdown__separator {
  font-size: 24rpx !important;
}
// .b-6::after{
//  display: block;
//  content: '';
//  height: 25rpx;
//  position: absolute;
//  border-right: 1rpx solid white;
//  top: 5rpx;
//  right: 0;
// }
.b-6-box .b-6:last-child::after {
  display: none;
}
.b-7 {
  background-color: #f5f7fc;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
}
.b-8 {
  display: flex;
  align-items: center;
}
.b-10 {
  height: 40rpx;
  background-color: rgba(0, 89, 255, 0.2);
  color: $tn-theme-color;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  margin: 0 10rpx;
}
.b-12-box {
  padding: 30rpx;
}
.b-13 {
  font-size: 30rpx;
  font-weight: bold;
}
.b-14-box {
  width: fit-content;
  display: flex;
}
.b-14-box .active {
  border: 1px solid $tn-theme-color;
  box-sizing: border-box;
}
.b-14 {
  background-color: #f5f7fc;
  border-radius: 16rpx;
  width: 222rpx;
  overflow: hidden;
  margin-right: 20rpx;
  border: 1px solid $tn-font-sub1-color;
}
.b-15 {
  width: 220rpx;
  height: 220rpx;
  flex-shrink: 0;
}
.b-16 {
  padding: 15rpx 10rpx;
  color: $tn-font-sub1-color;
}
.b-14-box .active .b-16 {
  color: $tn-theme-color;
}
.b-17 {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.b-18 {
  font-size: 24rpx;
}
.b-19 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.b-20 {
  font-size: 32rpx;
  color: $tn-font-title-color;
  font-weight: bold;
}
.b-21 {
  display: flex;
  align-items: center;
}
.b-23 {
  margin-top: 30rpx;
}
.b-24 {
  display: flex;
  justify-content: space-between;
}
.b-26 {
  width: 72rpx;
  height: 72rpx;
  border-radius: 100%;
}
.b-27 {
  width: 600rpx;
}
.b-28 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.b-30-box {
  display: flex;
  align-items: center;
}
.b-30 {
  font-size: $tn-font-title-color;
  font-weight: bold;
  margin-right: 10rpx;
}
.b-31 {
  color: $tn-middle-color;
  font-size: 24rpx;
  margin-top: 5rpx;
}
.b-32 {
  display: flex;
  align-items: center;
}
.b-33 {
  margin-left: 10rpx;
}
.b-34 {
  margin-top: 20rpx;
}
.b-35 {
  margin-top: 10rpx;
  font-size: 0;
}
.b-36 {
  width: 187rpx;
  height: 187rpx;
  border-radius: 16rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
}
.b-35 .b-36:nth-child(3n) {
  margin-right: 0;
}
.b-37 {
  padding: 20rpx 30rpx;
  // background-color: $tn-bg1-color;
}
.b-38 {
  font-size: 33rpx;
  font-weight: bold;
  color: $tn-font-title-color;
}
.b-39 {
  font-size: 28rpx;
  color: $tn-font-sub1-color;
  margin-top: 10rpx;
}
.b-40 {
  height: 74rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  margin-top: 20rpx;
  background-color: $tn-bg1-color;
}
.b-41 {
  height: 100%;
  width: 550rpx;
  padding-right: 20rpx;
}
.b-42 {
  padding-left: 25rpx;
  border-left: 1rpx solid #d9d9d9;
  color: $tn-font-sub1-color;
}
.b-13-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.b-43 {
  display: flex;
  background-color: $tn-bg1-color;
  padding: 10rpx 20rpx;
  border-radius: 16rpx;
}
.b-44 {
  flex-shrink: 0;
  color: $tn-font-sub1-color;
}
.b-45 {
  margin-top: 5rpx;
}
.b-46 {
  margin-left: 20rpx;
  display: flex;
}
.b-48 {
  text-decoration: line-through;
}
::v-deep  .tn-number-box-class .tn-number-box__btn__minus {
  width: 80rpx;
}
::v-deep  .tn-number-box-class .tn-number-box__btn__plus {
  width: 80rpx;
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
  width: 520rpx;
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

.c-56 {
  // padding: 0 30rpx;
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
.c-65 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  // width: calc(100% + 60rpx);
  // position: relative;
  // left: -30rpx;
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
  background-color: white;
  padding: 20rpx 30rpx;
  border-top: 1px solid $tn-border-solids-color;
}
.c-71 {
  margin-top: 10rpx;
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
.c-2 {
  padding: 20rpx;
  background-color: white;
  border-radius: 8rpx;
}
::v-deep  .tn-icon-close-fill {
  font-size: 40rpx !important;
  color: $tn-font-title-color !important;
}
::v-deep  .tn-tips {
  z-index: 99999999 !important;
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

//商品标题 价格
.goodTitle {
  width: 100%;
  background-color: #fff;
  padding: 0 28rpx;
  padding-bottom: 24rpx;
  border-bottom: 20rpx solid #f5f7fc;
  box-sizing: border-box;
  .goodTitle_t {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-top: 36rpx;
    height: 104rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;

    .goodTitle_tl {
      display: flex;
      align-items: baseline;
      height: 56rpx;
      display: flex;
      margin-right: 14rpx;
      box-sizing: border-box;
      text {
        &:nth-child(1) {
          height: 28rpx;
          font-size: 28rpx;
          color: $tn-theme-color;
          // padding-top: 20rpx;
          box-sizing: border-box;
        }
        &:nth-child(2) {
          height: 48rpx;
          font-size: 48rpx;
          font-weight: 600;
          color: $tn-theme-color;
        }
        &:nth-child(3) {
          height: 28rpx;
          font-size: 28rpx;
          color: $tn-theme-color;
          // padding-top: 20rpx;
          box-sizing: border-box;
        }
      }
    }
    .pricTips {
      display: inline-block;
      // height: 60rpx;
      background: $tn-dot-color;
      padding: 10rpx 22rpx;
      border-radius: 36rpx;
      margin-right: 14rpx;
      box-sizing: border-box;
      .pricTips_c {
        font-size: 24rpx;
        color: $tn-bg-color;
        display: flex;
        align-items: baseline;
        box-sizing: border-box;
        text {
          &:nth-child(1) {
            height: 28rpx;
            font-size: 28rpx;
            // padding-top: 20rpx;
            box-sizing: border-box;
          }
          &:nth-child(2) {
            height: 28rpx;
            font-size: 28rpx;
            // padding-top: 20rpx;
            box-sizing: border-box;
          }
          &:nth-child(3) {
            height: 48rpx;
            font-size: 48rpx;
            font-weight: 600;
          }
          &:nth-child(4) {
            height: 28rpx;
            font-size: 28rpx;
            // padding-top: 20rpx;
            box-sizing: border-box;
          }
        }
      }
    }

    .goodTitle_tc {
      flex: 1;
      font-size: 24rpx;
      font-weight: 500;
      color: $my-font-sub-color;
      text-decoration: line-through;
      // padding-top: 26rpx;
    }

    .original_price {
      display: inline-block;
      height: 40rpx;
      padding: 6rpx 12rpx;
      border-radius: 8rpx;
      background: $tn-smallLabel-bg-color;
      display: flex;
      justify-content: center;
      align-items: center;
      .soldBox {
        font-size: 20rpx;
        font-weight: 500;
        color: $my-font-sub-color;
        margin-right: 6rpx;
      }
      .num {
        font-size: 20rpx;
        font-weight: 600;
        color: #333;
      }
    }
  }
  .discount_tips {
    display: inline-block;
    padding: 4rpx 10rpx;
    font-size: 24rpx;
    color: $tn-bg-color;
    background-color: $tn-dot-color;
    border-radius: 8rpx;
  }
  .goodTitle_c {
    font-size: 32rpx;
    font-weight: bold;
    color: $tn-font-title-color;
    margin-bottom: 10rpx;
  }
  .goodTitle_b {
    font-size: 24rpx;
    font-weight: 500;
    color: $my-font-sub-color;
  }
}

//购买须知
.Instructions {
  width: 100%;
  padding: 0 30rpx;
  border-bottom: 16rpx solid #f5f7fc;
  box-sizing: border-box;
  .title {
    width: 100%;
    height: 86rpx;
    line-height: 86rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: $tn-font-title-color;
  }
  .content {
    display: block;
    width: 100%;
    font-size: 28rpx;
    line-height: 48rpx;
    color: $tn-font-color;
    // min-height: 108rpx;
    // padding: 18rpx 0;
    // padding-top: 10rpx;
    margin-bottom: 30rpx;
    box-sizing: border-box;
  }
  .border_box {
    border-bottom: 1rpx solid #e0e0e0;
  }
  .content_act {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .food {
    width: 100%;
    height: 72rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: $tn-theme-color;
  }
}

.foodBox {
  position: fixed;
  width: 100%;
  height: 160rpx;
  padding: 0 28rpx;
  padding-top: 16rpx;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
  bottom: 0;
  transition: all 0.25s ease-out;
  will-change: transform;
  z-index: 100;
  box-sizing: border-box;
  .foodBox_l {
    height: 56rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: $my-font-title-color;
    background: transparent;
    margin: 0;
    padding: 0;
    padding-top: 40rpx;

    .foodBox_ll {
      width: 56rpx;
      height: 56rpx;
      background: url(https://gani-sglm.oss-cn-hangzhou.aliyuncs.com/mf0010.png) no-repeat;
      background-size: contain;
      margin-right: 8rpx;
    }
  }
}

.payBtn {
  width: 240rpx;
  height: 88rpx;
  background: linear-gradient(90deg, rgba(0, 89, 255, 1) 0%, rgba(66, 132, 255, 1) 100%);
  padding: 0;
  margin: 0;
  border-radius: 45rpx;
  color: #fff;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.disBtn {
  background: #999;
}
</style>
