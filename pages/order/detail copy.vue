<template>
  <view class="oa-content" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 120rpx)' : '120rpx' }">
    <!-- <view class="a-0" :style="{height: vuex_custom_bar_height + 'px'}">
			<image src="/static/top_bg.png" style="width: 100%;height: 100%;"></image>
			<tn-nav-bar backgroundColor="transparent" :backTitle="backTitle">
				订单详情
			</tn-nav-bar>
		</view> -->
    <view class="tn-padding-bottom-xl">
      <view class="d-1">
        <view class="d-2">
          <!-- <text>待</text>支付预约金... -->
          {{ formatOrderStatus(detail) }}
        </view>
        <view class="d-3" v-if="logs[logs.length - 1].content">
          {{ logs[logs.length - 1].content }}
        </view>
        <view class="c-2" style="margin-top: 30rpx" v-if="detail.status > 22 && detail.status != 27">
          <view class="d-11-box">
            <view class="d-11">
              <image :src="workerInfo.work.workerPicUrl" class="d-12"></image>
              <view class="d-13">
                <view class="d-14">{{ workerInfo.work.workerName }}</view>
                <view class="d-15">
                  <view class="d-16"
                    >接单<text>{{ workerInfo.work.count + 300 }}</text
                    >次</view
                  >
                  <tn-rate :size="24" v-model="workerInfo.work.grade * 1" inactiveIcon="star-fill" activeColor="#ffca3e" :count="count" :disabled="true"></tn-rate>
                </view>
              </view>
            </view>
            <tn-button backgroundColor="#0059FF" fontColor="#ffffff" @click="callPhone">联系师傅</tn-button>
          </view>
        </view>
        <!-- 	<view class="c-2">
					<view class="c-25" style="border-bottom: none;">施工情况</view>
					<view class="d-18">
						<tn-subsection buttonColor="#0059FF" :list="constructionStatus" mode="button" :borderRadius="50"></tn-subsection>
					</view>
					<view class="d-19">
						<swiper class="card-swiper" @click="tn('')" :circular="true" 
						  :autoplay="true" duration="500" interval="8000" @change="cardSwiper"> 
						  <swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
						    <view class="swiper-item image-banner">
						      <image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
						    </view>
						  </swiper-item>
						</swiper>
						<view class="indication">
							<view class="d-20">
								<view class="d-21-box">
									<view class="d-21">{{cardCur+1}}</view>
									<view class="d-22">/</view>
									<view class="d-23">{{swiperList.length}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="c-26-box">
						<view class="c-26">
							<view class="c-27">上门时间</view>
							<view class="c-28">2024-08-01 15:58:03</view>
						</view>
						<view class="c-26">
							<view class="c-27">施工开始时间</view>
							<view class="c-28">2024-08-01 15:58:03</view>
						</view>
						<view class="c-26" style="margin-bottom: 0;">
							<view class="c-27">施工完成时间</view>
							<view class="c-28">2024-08-01 15:58:03</view>
						</view>
					</view>
				</view> -->
        <!-- 				<view class="c-2" v-if="detail.status>=24 && detail.status!=27 && detail.orderTag!='1'">
					<view class="c-25" style="border-bottom: none;">防伪认证<text class="d-17">非简一膜材或私下交易,平台不保售后</text></view>
					<view class="c-13">
						<view class="c-14">
							 <tn-image-upload uploadText="产品防伪码照片" :multiple="false" maxCount="1" :action="action" :fileList="fileList" @onSuccess="uploadSuccess" @onRemove="uploadRemove" :showProgress="false" @on-choose-complete="chooseComplete" @on-error="uploadError"></tn-image-upload>
						</view>
					</view>
				</view> -->
        <!-- 				<view class="d-4">
					<tn-button class="d-5" width="100%" backgroundColor="#0059FF" :plain="true" fontColor="#0059FF" shape="round">取消订单</tn-button>
					<tn-button class="d-6" width="100%" backgroundColor="#0059FF" shape="round" fontColor="#ffffff">立即支付</tn-button>
				</view> -->
        <view class="c-2">
          <view class="c-15" v-for="item in detail.items" :key="item.id">
            <image class="c-16" :src="item.picUrl"></image>
            <view class="c-17">
              <view class="c-18">{{ item.spuName }}</view>
              <view class="c-19-box">
                <view class="c-19" v-for="(item1, index1) in item.properties" :key="index1">{{ item1.propertyName + ':' + item1.valueName }}<text>/</text></view>
              </view>
              <view style="display: flex; gap: 20rpx; margin-top: 5rpx">
                <!-- <tn-button class="tn-button" shape="round" backgroundColor="#0059FF" :fontSize="24" fontColor="#FFFFFF" size="sm" v-if="detail.buttons.includes('afterSales')" @click="tn('./afterSales/apply?orderId='+id+'&itemId='+item.id)">
									<text class="">申请售后</text>
								</tn-button> -->
                <pay-button-sdk v-if="detail.buttons.includes('afterSales')" :mode="1" :order-status="1" :order-id="orderIdStr" :refund-total-amount="orderIdForRefundAmount" :apply-refund-params="applyRefundParams" @applyrefund="applyRefund">
                </pay-button-sdk>
                <tn-button
                  class="tn-button"
                  shape="round"
                  backgroundColor="#0059FF"
                  :fontSize="24"
                  fontColor="#FFFFFF"
                  size="sm"
                  v-if="detail.status == 30 && detail.orderTag != '1'"
                  @click="tn('./quality/quality?orderId=' + id + '&itemId=' + item.id)"
                >
                  <text class="">质保凭证</text>
                </tn-button>
              </view>
              <view class="c-20">
                <view class="c-21"
                  ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item.price / 100).toFixed(2)) }}</text></view
                >
                <!-- <view class="c-22">x{{item.count / 10000}}m²</view> -->
              </view>
            </view>
          </view>
        </view>
        <view class="c-2" v-if="detail.receiverAreaId > 0">
          <view class="c-25">预约信息</view>
          <view class="c-26-box">
            <!-- 	<view class="c-26">
							<view class="c-27">预约项目</view>
							<view class="c-28">灶台防护贴膜</view>
						</view> -->
            <view class="c-26">
              <view class="c-27">施工地址</view>
              <view class="c-28">{{ detail.receiverAreaName }} {{ detail.receiverDetailAddress }}</view>
            </view>
            <view class="c-26">
              <view class="c-27">联系人</view>
              <view class="c-28">{{ detail.receiverName }}</view>
            </view>
            <view class="c-26">
              <view class="c-27">联系方式</view>
              <view class="c-28">{{ detail.receiverMobile }}</view>
            </view>
            <view class="c-26" style="margin-bottom: 0" v-if="detail.appointTime">
              <view class="c-27">预约时间</view>
              <view class="c-28 c2-28">{{ timestampToTime(detail.appointTime) }}</view>
            </view>
          </view>
        </view>
        <view class="c-2">
          <view class="c-25">费用明细</view>
          <view class="c-26-box">
            <view class="c-26">
              <view class="c-27">订单金额</view>
              <view class="c-28">￥{{ parseFloat((detail.totalPrice / 100).toFixed(2)) }}</view>
            </view>
            <!-- 						<view class="c-26">
							<view class="c-27">施工费<text class="tn-icon-help"></text></view>
							<view class="c-28">待师傅上门确认</view>
						</view>
						<view class="c-26">
							<view class="c-27">附加费<text class="tn-icon-help"></text></view>
							<view class="c-28">待师傅上门确认</view>
						</view>
						<view class="c-26">
							<view class="c-27">优惠券</view>
							<view class="c-28 c1-28">无可用优惠券<text class="tn-icon-right"></text></view>
						</view>
						<view class="c-26 c1-26">
							<view class="c-27">合计</view>
							<view class="c-28">待师傅上门确认</view>
						</view> -->
            <view class="c-29">
              <text class="c-30">团购价格</text>
              <text class="c-31">￥{{ parseFloat((detail.payPrice / 100).toFixed(2)) }}</text>
            </view>
          </view>
        </view>
        <view class="c-2">
          <view class="c-25">施工说明</view>
          <view class="c-26-box">
            <view class="c-26">
              <view class="c-27">施工场景照片</view>
              <view class="c-28 c2-28" @click="previewImage(detail.areaImages)">查看</view>
            </view>
            <view class="c-26">
              <view class="c-27">施工对象照片</view>
              <view class="c-28 c2-28" @click="previewImage(detail.areaToolImages)">查看</view>
            </view>
          </view>
          <view class="c-32" v-if="detail.remark">
            <view class="c-33">备注</view>
            <view class="c-34">
              <tn-input class="c-35" inputAlign="right" v-model="detail.remark" placeholder="请填写" :disabled="true" :clearable="false" />
            </view>
          </view>
        </view>
        <view class="c-2">
          <view class="c-26-box" style="margin-top: 0">
            <view class="c-26">
              <view class="c-27">订单编号</view>
              <view class="c-28">
                {{ detail.no }}
                <view class="c1-31" @click="copy(detail.no)">复制</view>
              </view>
            </view>
            <view class="c-26">
              <view class="c-27">下单时间</view>
              <view class="c-28">{{ timestampToTime(detail.createTime) }}</view>
            </view>
            <view class="c-26" v-if="detail.payTime">
              <view class="c-27">支付时间：</view>
              <view class="c-28">{{ timestampToTime(detail.payTime) }}</view>
            </view>
            <view class="c-26" v-if="detail.status > 21 && detail.laborMaterial">
              <view class="c-27">预约时间：</view>
              <view class="c-28">{{ timestampToTime(detail.appointTime) }}</view>
            </view>
            <view class="c-26" v-if="detail.status >= 24 && detail.laborMaterial">
              <view class="c-27">上门时间：</view>
              <view class="c-28">{{ timestampToTime(detail.onsiteTime) }}</view>
            </view>
            <view class="c-26" v-if="detail.status >= 25 && detail.laborMaterial">
              <view class="c-27">开始施工时间：</view>
              <view class="c-28">{{ timestampToTime(detail.constructStartTime) }}</view>
            </view>
            <view class="c-26" v-if="[25, 30, 40].includes(detail.status) && detail.laborMaterial">
              <view class="c-27">完工时间：</view>
              <view class="c-28">{{ timestampToTime(detail.constructCompleteTime) }}</view>
            </view>
            <view class="c-26" v-if="[30, 40].includes(detail.status) && detail.laborMaterial">
              <view class="c-27">验收时间：</view>
              <view class="c-28">{{ timestampToTime(detail.checkTime) }}</view>
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
    </view>
    <!-- 悬浮按钮-->
    <view class="tn-flex tn-footerfixed tn-padding" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 20rpx)' : '' }" v-if="detail.buttons.length">
      <view class="tn-flex tn-flex-1 justify-content-item tn-text-center c-38">
        <!-- <view class="c-35">
					<view class="c-37">余款：</view>
					<view class="c-36"><text>￥</text>69.00</view>
				</view> -->
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" v-if="detail.buttons.includes('appointment')" @click="isLogin ? toAppointment() : login()">
          <text class="">预约上门</text>
        </tn-button>
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" v-if="detail.buttons.includes('changeAppointment')" @click="isLogin ? (showYyModal = true) : login()">
          <text class=""> 修改预约时间</text>
        </tn-button>
        <!-- 	<tn-button class="tn-button" backgroundColor="#0059FF" fontColor="#ffffff" style="min-width: 180rpx;" shape="round" v-if="item.buttons.includes('cancelAppointment')" @click="cancelAppointment">取消预约</tn-button> -->
        <!-- 		<tn-button class="tn-button c-39 c1-39" shape="round" :plain="true" backgroundColor="#7A8499" fontColor="#7A8499" padding="40rpx 0" width="100%" :fontSize="28" v-if="detail.buttons.includes('cancel')">
					<text class="">取消订单</text>
				</tn-button>
				<tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" v-if="detail.buttons.includes('pay')">
					<text class="">继续支付</text>
				</tn-button> -->
        <tn-button
          class="tn-button c-39"
          shape="round"
          backgroundColor="#0059FF"
          padding="40rpx 0"
          width="100%"
          :fontSize="28"
          fontColor="#FFFFFF"
          v-if="detail.buttons.includes('commentWorker')"
          @click="isLogin ? tn('./comment/add?id=' + id) : login()"
        >
          <text class="">评价师傅</text>
        </tn-button>
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" v-if="detail.buttons.includes('check')" @click="isLogin ? onCheck() : login()">
          <text class="">确认验收</text>
        </tn-button>
        <tn-button
          class="tn-button c-39"
          shape="round"
          backgroundColor="#0059FF"
          padding="40rpx 0"
          width="100%"
          :fontSize="28"
          fontColor="#FFFFFF"
          v-if="detail.buttons.includes('construction')"
          @click="isLogin ? tn('./constructionDetails?id=' + id) : login()"
        >
          <text class="">查看施工</text>
        </tn-button>
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" v-if="detail.buttons.includes('finishPay')" @click="isLogin ? onFinishPay() : login()">
          <text class="">支付余款</text>
        </tn-button>
        <tn-button
          class="tn-button c-39"
          shape="round"
          backgroundColor="#0059FF"
          padding="40rpx 0"
          width="100%"
          :fontSize="28"
          fontColor="#FFFFFF"
          v-if="detail.buttons.includes('viewWorkerComment')"
          @click="isLogin ? tn('./comment/add?id=' + id) : login()"
        >
          <text class="">查看师傅评价</text>
        </tn-button>
      </view>
    </view>

    <tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
    <tn-toast ref="toast"></tn-toast>
    <tn-modal v-model="checkInfo.show" :title="checkInfo.title" :content="checkInfo.content" :button="checkInfo.button" @click="clickCheck"></tn-modal>
    <tn-modal v-model="cancelAppointmentInfo.show" :title="cancelAppointmentInfo.title" :content="cancelAppointmentInfo.content" :button="cancelAppointmentInfo.button" @click="clickCancelAppointment"></tn-modal>
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
    <tuniaoui-wx-user-info v-model="loginShow" @updated="updatedUserInfoEvent"></tuniaoui-wx-user-info>
  </view>
</template>

<script>
import store from '../../store/index.js'
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import { timestampToTime, formatOrderStatus, handleOrderButtons } from '@/util/util.js'
import tuniaouiWxUserInfo from '@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue'
export default {
  name: 'TemplatePending',
  components: { tuniaouiWxUserInfo },
  mixins: [template_page_mixin],
  data() {
    return {
      timestamp: 86400,
      rate: 4,
      count: 5,
      constructionStatus: ['施工前', '施工中', '施工后'],
      swiperList: [
        {
          id: 0,
          type: 'image',
          title: '',
          name: '',
          text: '',
          url: 'https://cdn.nlark.com/yuque/0/2023/jpeg/280373/1681955091346-assets/web-upload/e05d86a5-1cec-40b0-8198-734d8b8379da.jpeg',
        },
        {
          id: 1,
          type: 'image',
          title: '合作勾搭',
          name: '作者微信 tnkewo',
          text: '',
          url: 'https://cdn.nlark.com/yuque/0/2023/jpeg/280373/1683257848160-assets/web-upload/357eefff-1d01-4502-87b7-26a50e3c63d1.jpeg',
        },
        {
          id: 2,
          type: 'image',
          title: '海量分享',
          name: '总有你想不到的创意',
          text: '',
          url: 'https://cdn.nlark.com/yuque/0/2023/jpeg/280373/1683257844089-assets/web-upload/787ff088-886a-4d5c-9fcb-7120f60a39ba.jpeg',
        },
        {
          id: 3,
          type: 'image',
          title: '酷炫多彩',
          name: '更多彩蛋等你探索',
          text: '',
          url: 'https://cdn.nlark.com/yuque/0/2023/jpeg/280373/1683257844146-assets/web-upload/b82e6f1e-9a3d-4ca6-931e-c3095a542899.jpeg',
        },
      ],
      cardCur: 0,
      currentIndex: 0,

      id: '',
      detail: {
        buttons: [],
        securityImages: '',
      },
      logs: [{ content: '' }],
      formatOrderStatus,
      handleOrderButtons,
      timestampToTime,
      workerInfo: '',
      action: '',
      fileList: [],
      security: '',
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
      showYyModal: false,
      days: [],
      active_index: 0,
      times: [],
      selectTime: '',
      appointTime: '',
      isLogin: false,

      itemOrdeId: '',
      orderIdForRefundAmount: 0,
      applyRefundParams: '',
      orderIdStr: '',
    }
  },
  watch: {
    loginShow: {
      handler(newValue, oldValue) {
        console.log('loginShow changed:', newValue, oldValue)
        if (!newValue) {
          this.getuser()
          this.getDetail()
          this.getWorker()
          this.isLogin = uni.getStorageSync('token') ? true : false
        }
      },
      deep: true, // 开启深度监听以检测数组内部项的变化
    },
  },
  onLoad(options) {
    this.days = this.getNext7Days()
    this.getHalfHourIntervalsFrom9To20()
    if (options.id) {
      this.id = options.id
      this.getDetail()
      // this.getWorker()
    }
  },
  onShow() {
    this.action = this.$http.commoneUrl + 'app-api/infra/file/upload'
    this.isLogin = uni.getStorageSync('token') ? true : false
    this.getuser()
  },
  methods: {
    getuser() {
      this.$http.getRequest('app-api/member/user/get').then(res => {
        if (res.code == 0) {
          store.commit('$tStore', {
            name: 'loginShow',
            value: false,
          })
          this.isLogin = true
        } else if (res.code == 401) {
          store.commit('$tStore', {
            name: 'loginShow',
            value: true,
          })
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
    login() {
      console.log(111111)
      store.commit('$tStore', {
        name: 'loginShow',
        value: true,
      })
    },
    // 获取到的用户信息
    // updatedUserInfoEvent(info) {
    //   console.log('获取到的用户信息', info)
    // 		let that = this
    // 		that.$http.putNewRequest('app-api/member/user/update',info)
    // 			.then(res => {
    // 				if(res.code == 0){
    // 					that.loginShow = false
    // 					that.isLogin = true
    // 					that.getDetail()
    // 					that.getWorker()
    // 					// that.getuser();
    // 				}else{
    // 					this.$refs.tips.show({
    // 						  msg: res.msg,
    // 						  backgroundColor: '#E83A30',
    // 						  fontColor: '#FFFFFF',
    // 						  duration: 1500
    // 						})
    // 				}
    // 			})
    // },
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

      let that = this
      let url = ''
      if (that.detail.appointTime) {
        url = 'app-api/trade/work/changeAppointTime'
      } else {
        url = 'app-api/trade/work/appointTime'
      }
      that.$http
        .putNewRequest(url, {
          appointEndTime: that.appointEndTime,
          appointTime: that.appointTime,
          orderId: that.id,
        })
        .then(res => {
          if (res.code == 0) {
            that.$refs.toast.show({
              title: '预约成功',
              icon: 'success',
              image: '',
              duration: 1000,
            })
            that.getDetail()
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
    cardSwiper(e) {
      this.cardCur = e.detail.current
    },
    getDetail() {
      this.fileList = []
      this.$http
        .getRequest('app-api/trade/order/get-detail', {
          id: this.id,
        })
        .then(res => {
          if (res.code == 0) {
            this.detail = res.data

            this.orderIdStr = res.data.id + ''
            this.detail.item = this.detail.items.filter(item => item.id == this.itemId)
            this.getSpuRefundItemId()

            this.handleOrderButtons(this.detail)
            if (this.detail.securityImages) {
              this.fileList = [{ url: this.detail.securityImages }]
            }
            if (this.detail.status > 22) {
              this.getOrderLog()
              if (this.detail.status != 27) {
                this.getWorker()
              }
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

    getSpuRefundItemId() {
      this.$http
        .getRequest('app-api/trade/order/getTTOrderItemId', {
          id: this.id,
        })
        .then(res => {
          if (res.code == 0) {
            this.itemOrdeId = res.data

            this.orderIdForRefundAmount = this.detail.items[0].price
            this.applyRefundParams = {
              orderId: this.orderIdStr,
              itemOrderList: [{ itemOrderId: this.itemOrdeId, refundAmount: this.detail.items[0].price }],
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

    //融合预约订单未预约单独退
    applyRefund(event) {
      const { orderId } = event.detail
      const itemOrderList = [
        {
          itemOrderId: this.itemOrdeId, //商品单，可在预下单回调itemOrderlist里获取，或通过查询券状态接口获取
          refundAmount: this.detail.items[0].price / 100, //退款金额必传，如果使用营销，需传原价
        },
      ]
      const extra = { orderId, itemOrderList }
      console.log(extra)
      return new Promise(resolve => {
        resolve(extra)
      })
    },

    getOrderLog() {
      this.$http
        .getRequest('app-api/trade/order/get-order-log', {
          id: this.id,
        })
        .then(res => {
          if (res.code == 0) {
            this.logs = res.data
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
    getWorker() {
      this.$http
        .getRequest('app-api/trade/work/getWorkStatusLog', {
          workId: this.id,
        })
        .then(res => {
          if (res.code == 0) {
            this.workerInfo = res.data
            this.workerInfo.work.grade = 5
          } else if (res.code == 401) {
            this.isLogin = false
            store.commit('$tStore', {
              name: 'loginShow',
              value: true,
            })
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
    //拨打电话
    callPhone() {
      let that = this
      uni.makePhoneCall({
        phoneNumber: that.workerInfo.work.workerPhone,
        success: () => {
          console.log('拨打电话成功！')
        },
        fail: () => {
          that.$refs.tips.show({
            msg: '拨打电话失败！',
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 1500,
          })
        },
      })
    },
    chooseComplete() {
      uni.showLoading({
        title: '上传中...',
      })
    },
    uploadSuccess(data, index, lists) {
      console.log()
      uni.hideLoading()
      if (data.code == 0) {
        this.security = data.data

        this.$http
          .postRequest('app-api/trade/order/update-security-images', {
            orderId: this.id,
            updateSecurityImages: this.security,
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
      }
      // console.log(this.images)
    },
    uploadError() {
      uni.hideLoading()
      this.$refs.tips.show({
        msg: '上传失败',
        backgroundColor: '#E83A30',
        fontColor: '#FFFFFF',
        duration: 1500,
      })
    },
    uploadRemove(index, lists, name) {
      this.fileList = []
      this.security = ''
      // console.log(this.images)
    },
    previewImage(url) {
      uni.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url], // 需要预览的图片http链接列表
      })
    },
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
    // 验收
    onCheck() {
      this.checkInfo.show = true
    },
    // 取消预约
    cancelAppointment() {
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
            this.getDetail()
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
    onFinishPay() {
      let that = this
      that.$http
        .getRequest('app-api/pay/order/get', {
          id: that.detail.finishPayOrderId,
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
                      this.getDetail()
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
    //复制
    copy(text) {
      let that = this
      uni.setClipboardData({
        data: text,
        success: () => {
          // that.$refs.toast.show({
          //   title: '复制成功',
          //   icon: 'success',
          //   image: '',
          //   duration: 1000
          // })
        },
      })
    },
    toAppointment() {
      this.tn(
        '/pages/goods/reservation?data=' +
          encodeURIComponent(
            JSON.stringify({
              items: [
                {
                  skuId: this.detail.items[0].skuId,
                  count: this.detail.items[0].count,
                  //  skuLength:100,
                  // skuWidth :100
                  // categoryId: that.detail.categoryId
                },
              ],
              // TODO 芋艿：后续清理掉这 2 参数
              deliveryType: 1,
              pointStatus: false,
              ttId: this.detail.ttId,
              id: this.detail.id,
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
.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: white;
}
/* 间隔线 end*/

/* 轮播视觉差 start */
.card-swiper {
  height: 356rpx !important;
  overflow: hidden;
  border-radius: 12rpx;
}

.card-swiper swiper-item {
  width: 100% !important;
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
  will-change: transform;
  overflow: hidden;
}

.card-swiper swiper-item.cur .swiper-item {
  transform: none;
  transition: all 0.2s ease-in 0s;
  will-change: transform;
}

.card-swiper swiper-item .swiper-item-text {
  margin-top: -300rpx;
  text-align: center;
  width: 100%;
  display: block;
  height: 50%;
  border-radius: 10rpx;
  transform: translate(100rpx, 0rpx) scale(0.9, 0.9);
  transition: all 0.6s ease 0s;
  will-change: transform;
  overflow: hidden;
}

.card-swiper swiper-item.cur .swiper-item-text {
  margin-top: -300rpx;
  width: 100%;
  transform: translate(0rpx, 0rpx) scale(0.9, 0.9);
  transition: all 0.6s ease 0s;
  will-change: transform;
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
  width: calc(100% - 100rpx);
  height: 36rpx;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.spot {
  background-color: #ffffff;
  opacity: 0.4;
  width: 10rpx;
  height: 10rpx;
  border-radius: 20rpx;
  top: -60rpx;
  margin: 0 8rpx !important;
  position: relative;
}

.spot.active {
  opacity: 0.6;
  width: 30rpx;
  background-color: #ffffff;
}

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
/deep/ .c1-39.tn-button button {
  background: white;
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
.c-2 {
  padding: 20rpx;
  background-color: white;
  border-radius: 8rpx;
  margin-top: 20rpx;
}
.c-13 {
  display: flex;
  justify-content: center;
}
.c-14 /deep/ .tn-image-upload__item {
  background-color: transparent !important;
  width: 640rpx !important;
  height: 400rpx !important;
  margin: 0 !important;
  border-radius: 16rpx;
  border: 1rpx dashed $tn-border-solids-color;
}
.c-15 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.c-2 .c-15:last-child {
  margin-bottom: 0;
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
  display: flex;
  align-items: center;
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
  max-width: 510rpx;
}
.c-28 text {
  margin-left: 10rpx;
}
.c1-28 {
  font-size: 24rpx;
}
.c2-28 {
  color: $tn-theme-color;
}
.c-29 {
  display: flex;
  justify-content: flex-end;
}
.c-31 {
  color: $tn-theme-color;
  font-weight: bold;
}
.c1-31 {
  height: 35rpx;
  border-radius: 16rpx;
  background: #f7f8f9;
  display: flex;
  align-items: center;
  padding: 0 15rpx;
  background: #f7f8f9;
  color: $tn-theme-color;
  margin-left: 10rpx;
}
.c-32 {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid $tn-border-solids-color;
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
.c-38 {
  width: 100%;
  gap: 20rpx;
}
.c-39 {
  flex: 1;
}

.d-1 {
  padding: 30rpx;
}
.d-2 {
  color: $tn-theme-color;
  font-size: 32rpx;
  font-weight: bold;
}
.d-2 text {
  color: $tn-font-title-color;
}
.d-3 {
  display: flex;
  margin-top: 20rpx;
}
.d-4 {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}
.d-5 {
  flex: 1;
  margin-right: 20rpx;
}
.d-6 {
  flex: 1;
}
.d-11-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.d-11 {
  display: flex;
  align-items: center;
}
.d-12 {
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
}
.d-13 {
  margin-left: 20rpx;
}
.d-14 {
  font-weight: bold;
  color: $tn-font-title-color;
}
.d-15 {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: $tn-font-sub1-color;
  margin-top: 10rpx;
}
.d-16 {
  margin-right: 10rpx;
}
.d-16 text {
  font-weight: bold;
  color: $tn-font-title-color;
  margin: 0 10rpx;
}
.d-17 {
  color: $tn-font-sub1-color;
  font-size: 24rpx;
  border-left: 1rpx solid $tn-border-solids-color;
  font-weight: initial;
  margin-left: 20rpx;
  padding-left: 20rpx;
}
.d-19 {
  margin-top: 20rpx;
}
.d-20 {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: -110rpx;
  margin-right: 30rpx;
}
.d-21 {
  font-weight: bold;
}
.d-21-box {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 50rpx;
  padding: 0 10rpx;
  display: flex;
  align-items: center;
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
pay-button {
  padding: 0px 15px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  width: auto;
  color: rgb(255, 255, 255);
  background-color: rgb(0, 89, 255);
  border: none;
}
</style>
