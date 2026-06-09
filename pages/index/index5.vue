<template>
  <view class="oa-content">
    <!-- 		<view class="a-0" :style="{height: vuex_custom_bar_height + 'px'}">
			<image src="/static/top_bg.png" style="width: 100%;height: 200%;"></image>
			<tn-nav-bar :isBack="false" backgroundColor="transparent">
				<view class="a-1" style="display: flex;">
					<image class="a2-1" src="../../static/logo.png" style="opacity: 0;"></image>
					<view class="a-3" @click="tn('/pages/goods/search')">
						<text class="tn-icon-search" style="color: #7A8499;"></text>
						<view style="color: #7A8499;font-size: 28rpx;margin-left: 20rpx;">关键字搜索</view>
					</view>
				</view>
			</tn-nav-bar>
		</view> -->
    <view class="tn-padding-bottom-xl">
      <view class="a-5">
        <!-- 轮播banner-->
        <swiper class="card-swiper" @click="tn('')" :circular="true" :autoplay="true" duration="500" interval="8000" @change="cardSwiper">
          <swiper-item v-for="(item, index) in swiperList" v-if="publish_status == 1 ? index == swiperList.length - 1 : true" :key="index" :class="cardCur == index ? 'cur' : ''">
            <view class="swiper-item image-banner">
              <image :src="item.imgUrl" mode="aspectFill"></image>
            </view>
          </swiper-item>
        </swiper>
        <view class="indication">
          <block v-for="(item, index) in swiperList" :key="index" v-if="publish_status == 1 ? index == swiperList.length - 1 : true">
            <view class="spot" :class="cardCur == index ? 'active' : ''"></view>
          </block>
        </view>
      </view>
      <!-- 			<view class="a-6" v-if="menuList.length>0">
				<tn-scroll-list :class="[menuList.length>5?'':'clearBottom']" indicatorActiveColor="#0059FF" :indicator="menuList.length>5">
				  <view class="tn-flex tn-margin-sm">
				    <block v-for="(item, index) in menuList" :key="index">
				      <view class="tn-flex-1 tn-padding-sm tn-margin-xs tn-radius" @click="tn(item.url.includes('https')?'/pages/singlePage/singlePage?url='+item.url:item.url)">
				        <view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
				          <view class="icon3__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur">
				            <image class="a-7" :src="item.iconUrl" mode="heightFix"></image>
				          </view>
				          <view class="tn-color-black tn-text-lg tn-text-center" style="margin-top: 10rpx;">
				            <text class="tn-text-ellipsis">{{item.title}}</text>
				          </view>
				        </view>
				      </view>
				    </block>
				  </view>
				</tn-scroll-list>
			</view> -->
      <view :class="[menuList.length > 0 ? 'a-8' : '']" style="margin-top: -10rpx">
        <view class="a-9">
          <view class="a-10">
            <view class="a-11">服务中心</view>
            <view class="a-12">一站全包，安心防护</view>
          </view>
          <view class="a-13" @click="tn('/pages/goods/list')">更多</view>
        </view>
        <view class="a-14" v-if="list.length > 0">
          <view class="a-15" v-for="(item, index) in list" v-if="index <= 5" :key="index" @click="tn('/pages/goods/detail?id=' + item.id)">
            <image class="a-16" :src="item.picUrl"></image>
            <view class="a-17">
              <view class="a-18">{{ item.name }}</view>
              <view class="a-19">
                <view class="a-20">
                  <view class="a-21"
                    ><text>{{ parseFloat((item.price / 100).toFixed(2)) }}</text
                    >元</view
                  >
                  <!-- <view class="a-22">上门</view> -->
                </view>
                <image class="a-23" src="../../static/right_img.png"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="a-8">
				<view class="a-9">
					<view class="a-10">
						<view class="a-11">膜材市场</view>
						<view class="a-12">膜材直供，自由贴装</view>
					</view>
					<view class="a-13" @click="tn('/pages/goods/list?categoryId='+99999999)">更多</view>
				</view>
				<view class="a-24-box" v-if="list1.length>0">
					<view class="a-24" v-for="(item1,index1) in list" :key="index1" @click="tn('/pages/goods/detail?id='+item1.id)">
						<image class="a-25" :src="item1.picUrl"></image>
						<view class="a-26">
							<view class="a-27">{{item1.name}}</view>
							<view class="a-28">
								<view class="a-29">{{item1.introduction}}</view>
							</view>
							<view class="a-30">
								<view class="a-31">已售 {{formatNum(item1.salesCount)}}</view>
								<view class="a-32"><text class="a-33">￥</text><text class="a-34">{{parseFloat((item1.price / 100).toFixed(2))}}</text><text class="a-35">/㎡</text></view>
							</view>
						</view>
					</view>
				</view>
			</view> -->
      <!-- <view class="" style="margin-top: 30rpx;" v-if="list.length>0">
				<tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
			</view> -->
      <view v-if="list.length == 0" class="wu">
        <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
      </view>
    </view>

    <tn-modal v-model="jdInfo.show" :title="jdInfo.title" :content="jdInfo.content" :button="jdInfo.button" @click="clickJd"></tn-modal>
    <tn-tips ref="tips" position="center"></tn-tips>
    <tn-toast ref="toast"></tn-toast>

    <!-- 合伙人弹窗 -->
    <!-- <my-pop ref="myPop" /> -->

    <tn-tabbar v-model="currentIndex" :list="tabbarList" activeColor="#838383" inactiveColor="#AAAAAA" activeIconColor="#0059FF" :animation="true" :safeAreaInsetBottom="true" @change="switchTabbar"></tn-tabbar>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import { timestampToTime } from '@/util/util.js'
import store from '@/store/index.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  computed: {
    computedPaddingTop() {
      // 假设 this.vuexCustomBarHeight 是从Vuex获取的自定义栏高度（单位px）
      // 注意：这里我们假设在Vue环境中，你可能需要处理单位转换，但Vue通常使用px
      // 如果你确实需要rpx，你可能需要基于设计稿宽度进行转换，但这在Vue中不常见
      // 这里仅作为示例，我们假设直接返回px值
      return `calc(${this.vuex_custom_bar_height}px + 80rpx)`
    },
  },
  data() {
    return {
      current: 0,
      pageNo: 1,
      fixedList: [
        {
          name: '全部',
          sort: 'asc',
        },
        {
          name: '按类型',
          sort: 'asc',
        },
        {
          name: '按金额',
          sort: 'asc',
        },
        {
          name: '按距离',
          sort: 'asc',
        },
        {
          name: '按时间',
          sort: 'asc',
        },
      ],
      timestampToTime,
      loadText: {
        loadmore: '上拉加载更多',
        loading: '快速加载中...',
        nomore: '已经没有了啊',
      },
      loadStatus: 'loadmore',
      list: [],
      list1: [],
      uid: 0,

      area: '位置获取中...',
      areaId: '',
      areaCode: ['42', '4201', '420111'],
      showArea: false,
      resetFuncList: [],
      isLogin: false,
      workerInfo: null,
      id: '',
      sortingFields: [
        { field: 'trw.status', order: 'asc' },
        { field: 'order_time', order: 'desc' },
      ],
      jdInfo: {
        show: false,
        title: '提示',
        content: '',
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
      projectName: '',
      // tabbar当前被选中的序号
      currentIndex: 0,
      cardCur: 0,
      swiperList: [],
      menuList: [],
      types: [
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
        {
          title: '灶台防护贴膜',
          money: 69,
          img: '/static/sl.jpg',
        },
      ],
      publish_status: 0,
    }
  },
  onLoad(options) {
    console.log(options)
    console.log(options.scene)
    console.log(decodeURIComponent(options.scene).split('=')[1])
    if (options.scene) {
      let key = decodeURIComponent(options.scene).split('=')[0]
      console.log(decodeURIComponent(options.scene).split('=')[0])
      if (key == 'distributor') {
        store.commit('$tStore', {
          name: 'distribution_code',
          value: decodeURIComponent(options.scene).split('=')[1],
        })
      }
      if (key == 'brokerageUserId') {
        store.commit('$tStore', {
          name: 'brokerageUserId',
          value: decodeURIComponent(options.scene).split('=')[1],
        })
      }
    }
    let that = this
    that.getDiyTemplate()
    that.getlist()
    this.dictType('publish_status')
  },
  onShow() {
    this.currentIndex = 0
    // this.$nextTick(function () {
    //   if (this.$refs.myPop) {
    //     console.log('11', this.$refs.myPop)
    //     this.$refs.myPop.activityPop = true
    //   }
    // })
  },
  methods: {
    // tab选项卡切换
    cardSwiper(e) {
      this.cardCur = e.detail.current
    },
    search() {
      this.pageNo = 1
      this.list = []
      this.getlist()
    },
    getlist() {
      this.loadStatus = 'loading'
      console.log(this.loadStatus)
      let data = {
        pageNo: this.pageNo,
        pageSize: 50,
        sourceType: 2,
      }
      let than = this
      than.$http.getRequest('app-api/product/spu/page', data).then(res => {
        if (res.code == 0) {
          let list = res.data.list
          if (list.length > 0) {
            than.pageNo = than.pageNo + 1
            list.forEach(item => {
              than.list.push(item)
            })
          }
          if (than.list.length < res.data.total) {
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
    getDiyTemplate() {
      this.$http.getRequest('app-api/promotion/diy-template/used').then(res => {
        if (res.code == 0) {
          this.swiperList = res.data.home.components[1].property.items
          this.menuList = res.data.home.components[2].property.list ? res.data.home.components[2].property.list : []
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
    // onReachBottom(){
    // 	this.getlist();
    // },
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
    switchTabbar(e, pagePath) {
      console.log(e)
      this.currentIndex = e
      uni.switchTab({
        url: pagePath,
      })
    },
    // 跳转
    tn(e) {
      console.log(e)
      uni.navigateTo({
        url: e,
        fail() {
          uni.switchTab({
            url: e,
          })
        },
      })
    },
    // 获取字典
    dictType(payChannelCode) {
      let that = this
      let label = ''
      that.$http.getRequest('app-api/system/dict-data/type?type=' + payChannelCode).then(res => {
        if (res.code == 0) {
          this.publish_status = res.data[0].value
          // return label
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
  },
}
</script>

<style lang="scss" scoped>
.wu {
  padding-top: 100rpx;
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
  padding-bottom: 120rpx;
  // padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
  // padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
}

.top-fixed {
  position: fixed;
  background-color: rgba(255, 255, 255, 1);
  top: 0;
  width: 100%;
  transition: all 0.25s ease-out;
  z-index: 100;
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
  box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
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

.icon3__item--icon {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fc;
  border-radius: 100%;
}
.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: white;
  overflow: hidden;
}
/deep/ .tn-tabs-class {
  background-color: transparent !important;
}
/deep/ .tn-bg-white {
  background-color: transparent !important;
  padding: 0 30rpx;
}
/deep/ .tn-custom-nav-bar__bar {
  box-shadow: none !important;
}
.a-1 {
  display: flex;
  padding: 0 30rpx;
  align-items: center;
  height: 100%;
}
.a-2 {
  display: flex;
  align-items: center;
  font-size: 40rpx;
}
.a1-2 {
  display: inline-block;
  max-width: 150rpx;
  font-size: 32rpx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.a2-1 {
  width: 50rpx;
  height: 50rpx;
  border-radius: 100%;
}
.a-3 {
  display: flex;
  align-items: center;
  margin-left: 30rpx;
  height: 60rpx;
  overflow: hidden;
  background-color: rgba(122, 132, 153, 0.1);
  border-radius: 100rpx;
  padding: 0 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350rpx;
}
.a-4 {
  width: 350rpx;
  font-size: 24rpx;
  text-align: left;
  height: 60rpx;
  padding-left: 10rpx;
}
.a-5 {
  padding: 30rpx;
  width: 100%;
}
.a-5 .indication {
  width: calc(100% - 60rpx);
}
.a-7 {
  height: 60%;
  width: auto;
}
.tn-text-ellipsis {
  font-size: 24rpx;
}
.tn-padding-sm {
  padding: 13rpx !important;
}
/deep/ .tn-scroll-list-class {
  background-color: white !important;
}
/deep/ .tn-scroll-list__indicator {
  margin-top: 0 !important;
}
.a-8 {
  margin-top: 20rpx;
}
.a-9 {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.a-10 {
  display: flex;
  align-items: flex-end;
}
.a-11 {
  color: $tn-font-title-color;
  font-size: 30rpx;
}
.a-12 {
  color: $tn-middle-color;
  font-size: 24rpx;
  position: relative;
  padding-left: 20rpx;
  margin-left: 20rpx;
  bottom: 5rpx;
}
.a-12::before {
  position: absolute;
  content: '';
  height: 24rpx;
  border-left: 1rpx solid $tn-middle-color;
  bottom: 5rpx;
  left: 0;
}
.a-13 {
  color: $tn-middle-color;
}
.a-14 {
  padding: 30rpx;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 1rpx;
}
.a-15 {
  width: 330rpx;
  height: 198rpx;
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  margin-right: 30rpx;
}
.a-14 .a-15:nth-child(2n) {
  margin-right: 0;
}
.a-16 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.a-17 {
  position: relative;
  z-index: 1;
  padding: 0 20rpx;
  padding-top: 30rpx;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0));
}
.a-18 {
  font-size: 26rpx;
  color: $tn-font-title-color;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.a-19 {
  width: 240rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid $tn-theme-color;
  border-radius: 50rpx;
  margin-top: 30rpx;
  font-size: 24rpx;
}
.a-20 {
  display: flex;
  align-items: center;
  padding-left: 20rpx;
}
.a-21 {
  color: $tn-theme-color;
}
.a-21 text {
  color: $tn-theme-color;
  font-weight: bold;
  font-size: 28rpx;
}
.a-22 {
  color: $tn-middle-color;
}
.a-23 {
  width: 40rpx;
  height: 40rpx;
}
.a-24-box {
  padding: 30rpx;
  background-color: white;
}
.a-24 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}
.a-24-box .a-24:last-child {
  margin-bottom: 0;
}
.a-26 {
  width: 485rpx;
}
.a-25 {
  width: 178rpx;
  height: 178rpx;
  border-radius: 8rpx;
}
.a-26 {
  position: relative;
}
.a-27 {
  color: $tn-font-title-color;
  font-size: 30rpx;
  font-weight: bold;
}
.a-28 {
  display: flex;
  margin-top: 10rpx;
  flex-wrap: wrap;
}
.a-29 {
  font-size: 24rpx;
  background-color: #ffebe6;
  color: $tn-dot-color;
  border-radius: 8rpx;
  margin-right: 20rpx;
  padding: 0 10rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.a-30 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.a-32 {
  font-size: 24rpx;
}
.a-33 {
  font-weight: bold;
}
.a-34 {
  color: $tn-theme-color;
  font-size: 34rpx;
  font-weight: bold;
}
.slider-container {
  position: relative;
  width: 100%;
  height: 70rpx; /* 根据需要调整 */
  background-color: #f0f0f0; /* 背景色，实际使用中可能用图片 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 40rpx; /* 轨道高度 */
  background-color: #ddd; /* 轨道颜色 */
  border-radius: 20rpx;
  overflow: hidden;
}

.slider-thumb {
  position: absolute;
  left: 0; /* 初始位置 */
  width: 50rpx; /* 滑块宽度 */
  height: 50rpx; /* 滑块高度 */
  background-color: #007aff; /* 滑块颜色 */
  border-radius: 50%;
  transition: transform 0.3s ease; /* 平滑过渡效果 */
}

.text {
  margin-top: 10rpx; /* 文本与滑块轨道的间距 */
  color: #333;
  font-size: 28rpx;
}
// /deep/ .tn-tabs__scroll-view__box{
// 	padding: 0 30rpx;
// }
/deep/ .tn-tabs__scroll-view__item {
  flex: initial !important;
  margin-right: 53rpx;
  font-size: 32rpx !important;
  overflow: initial;
}
/deep/ .tn-tabs__scroll-view__box .tn-tabs__scroll-view__item:nth-last-child(2) {
  margin-right: 0;
}
/deep/ .tn-tabs__scroll-view--flex {
  justify-content: left !important;
}
.robed {
  filter: grayscale(100%);
  s-webkit-filter: grayscale(100%);
}
.ybq_img {
  width: 200rpx;
  height: 200rpx;
  opacity: 0.8;
  position: absolute;
  top: 50rpx;
  right: 100rpx;
}
.clearBottom /deep/ .tn-scroll-list {
  padding-bottom: 0;
}

/deep/.tn-popup__content__center_box {
  background-color: rgba(0, 0, 0, 0) !important;
}

/deep/.tn-popup__mask {
  background-color: rgba(0, 0, 0, 0.7) !important;
}
</style>
