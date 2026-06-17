<template>
  <view class="oa-content" :style="{ paddingTop: navtypeList.length > 0 ? '230rpx' : '120rpx' }">
    <!-- 搜索 -->
    <my-search></my-search>

    <!-- 分类导航 -->
    <view class="nav_box" v-if="navtypeList.length > 0">
      <tn-tabs :list="navtypeList" :isScroll="false" :current="current" name="tab-name" @change="change" :height="64" :gutter="16" :activeItemStyle="activeItemStyle" inactiveColor="#999999" :showBar="false"></tn-tabs>
    </view>

    <view class="tn-padding-bottom-xl" style="padding-bottom: 0">
      <view :class="[menuList.length > 0 ? 'a-8' : '']" style="margin-top: -10rpx">
        <my-goodInfo :list="list" v-if="list.length > 0"></my-goodInfo>
        <tn-load-more v-if="list.length > 0" :status="loadStatus" :loadingIcon="false"></tn-load-more>
      </view>
    </view>

    <view v-if="list.length == 0" class="wu">
      <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
    </view>

    <tn-modal v-model="jdInfo.show" :title="jdInfo.title" :content="jdInfo.content" :button="jdInfo.button" @click="clickJd"></tn-modal>
    <tn-tips ref="tips" position="center"></tn-tips>
    <tn-toast ref="toast"></tn-toast>

    <tn-tabbar v-model="currentIndex" :list="tabbarList" activeColor="#0059FF" inactiveColor="#AAAAAA" activeIconColor="#0059FF" :animation="true" :safeAreaInsetBottom="true" @change="switchTabbar"></tn-tabbar>
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
      // 导航当前被选中的序号
      // navActiveIndex: 0,
      cardCur: 0,
      swiperList: [],
      menuList: [],
      navtypeList: [
        {
          name: '全部',
          id: '',
        },
      ],
      navtypeListIndex: 0,
      publish_status: 0,
      filterDate: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },

      activeItemStyle: {
        color: '#0059FF',
        fontWeight: '600',
        border: '2rpx solid #0059FF',
      },
    }
  },
  onLoad(options) {
    // console.log(options)
    // console.log(options.scene)
    // console.log(decodeURIComponent(options.scene).split('=')[1])
    if (options.scene) {
      let key = decodeURIComponent(options.scene).split('=')[0]
      // console.log(decodeURIComponent(options.scene).split('=')[0])
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
    // that.getCategoryList()
    // that.getlist()
    this.dictType('publish_status')
  },
  onShow() {
    this.currentIndex = 0
    this.filterDate.pageNo = 1
    this.list = []
    this.getCategoryList()
    this.getlist()
    // this.$nextTick(function () {
    //   if (this.$refs.myPop) {
    //     console.log('11', this.$refs.myPop)
    //     this.$refs.myPop.activityPop = true
    //   }
    // })
  },
  methods: {
    change(index) {
      this.current = index
      this.navtypeListIndex = index
      this.filterDate.pageNo = 1
      this.list = []
      this.getlist()
    },
    // tab选项卡切换
    cardSwiper(e) {
      this.cardCur = e.detail.current
    },
    // /product/category/list
    //获取分类
    getCategoryList() {
      let that = this
      that.navtypeList = []
      that.$http.getRequest('app-api/product/category/list').then(res => {
        if (res.code == 0) {
          that.navtypeList = [{ name: '全部', id: '' }]
          res.data.forEach(item => {
            if (item.parentId === 100) that.navtypeList.push(item)
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
    // 导航选择
    // selectNav(index) {
    //   if (this.navActiveIndex === index) return
    //   this.navActiveIndex = index
    //   // 尝试平滑滚动该项到可见区域，兼容不同平台
    //   this.$nextTick(() => {
    //     try {
    //       const ref = this.$refs['navItem' + index]
    //       if (ref && ref[0] && ref[0].scrollIntoView) {
    //         ref[0].scrollIntoView({ behavior: 'smooth', inline: 'center' })
    //       } else if (ref && ref.scrollIntoView) {
    //         ref.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    //       }
    //     } catch (e) {}
    //   })
    // },
    // search() {
    //   this.filterDate.pageNo = 1
    //   this.list = []
    //   this.getlist()
    // },
    getlist() {
      console.log('getlist')
      this.loadStatus = 'loading'
      let data = {
        pageNo: this.filterDate.pageNo,
        pageSize: this.filterDate.pageSize,
        sourceType: 2,
        categoryId: this.navtypeList.length > 0 ? this.navtypeList[this.navtypeListIndex].id : '',
      }
      let than = this
      than.$http.getRequest('app-api/product/spu/page', data).then(res => {
        if (res.code == 0) {
          let list = res.data.list
          this.filterDate.total = res.data.total
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

    formatNum(num) {
      // 情况二：小于等于 10
      if (num < 10) {
        // return `≤10`
        return num
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
      console.log('e', e)
      this.currentIndex = e
      uni.switchTab({
        url: pagePath,
      })
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

    // 切换分类：支持被自定义 Tab （index）或组件事件（可能传 number 或对象）调用
    chackType(e, payload, maybeIndex) {
      console.log('e', e, maybeIndex)
      let arrLneth = this.navtypeList.length
      let diffx = null

      const query = uni.createSelectorQuery().in(this)
      query
        .select('#nav_item0')
        .boundingClientRect(function (rect) {
          console.log('rect', rect)
          // rect.id // 节点的ID
          // rect.dataset // 节点的dataset
          // rect.width // 节点的宽度
          // rect.height // 节点的高度
          // rect.top // 节点的上边界坐标
          // rect.left // 节点的左边界坐标
          // rect.bottom // 节点的下边界坐标
          // rect.right // 节点的右边界坐标
        })
        .exec()

      // if (maybeIndex !== 0 && maybeIndex !== 1 && maybeIndex !== 2) {
      this.scollX2 = e.detail.x
      console.log('diffx', diffx)
      if (this.scollX2 > 200) {
        console.log('左移')
        if (maybeIndex !== arrLneth - 1 && maybeIndex !== arrLneth - 2 && maybeIndex !== arrLneth) {
          diffx = e.detail.x / 2
          this.scollX -= diffx
        }

        this.scollX3 = this.scollX2
      } else {
        console.log('右移')
        if (maybeIndex !== 0 && maybeIndex !== 1 && maybeIndex !== 2) {
          diffx = e.detail.x
          this.scollX += diffx
        }

        this.scollX3 = this.scollX2
      }

      // - uni.getSystemInfoSync().windowWidth / 2 + e.currentTarget.offsetWidth / 2
      console.log('scollX', this.scollX)
      let index = 0
      if (typeof payload === 'number') {
        index = payload
      } else if (typeof maybeIndex === 'number') {
        index = maybeIndex
      } else if (payload && typeof payload === 'object' && payload.index !== undefined) {
        index = payload.index
      }
      if (this.navtypeListIndex === index) return
      this.navtypeListIndex = index

      this.filterDate.pageNo = 1
      this.list = []
      this.getlist()
    },
  },
  onReachBottom() {
    this.filterDate.pageNo++
    this.getlist()
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
  padding: 120rpx 0 120rpx 0;
  // padding-bottom: 120rpx;
  background: $tn-space-color;
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

::v-deep  .tn-tabs-class {
  background-color: transparent !important;
}

::v-deep  .tn-bg-white {
  background-color: transparent !important;
  padding: 0 30rpx;
}

::v-deep  .tn-custom-nav-bar__bar {
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

::v-deep  .tn-scroll-list-class {
  background-color: white !important;
}

::v-deep  .tn-scroll-list__indicator {
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

// ::v-deep  .tn-tabs__scroll-view__box{
// 	padding: 0 30rpx;
// }
::v-deep  .tn-tabs__scroll-view__item {
  flex: initial !important;
  margin-right: 53rpx;
  font-size: 32rpx !important;
  overflow: initial;
}

::v-deep  .tn-tabs__scroll-view__box .tn-tabs__scroll-view__item:nth-last-child(2) {
  margin-right: 0;
}

::v-deep  .tn-tabs__scroll-view--flex {
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

.clearBottom ::v-deep  .tn-scroll-list {
  padding-bottom: 0;
}

//导航列表
.nav_box {
  width: 100%;
  height: 122rpx;
  position: fixed;
  top: 112rpx;
  left: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* iOS 上平滑滚动 */
  padding: 28rpx;
  padding-top: 32rpx;
  z-index: 99;
  background: $tn-bg1-color;
  box-sizing: border-box;
  // .nav_list {
  //   position: relative;
  //   display: flex;
  //   flex-wrap: nowrap;
  //   justify-content: flex-start; /* 不再 space-between */
  //   gap: 16rpx; /* 项之间的间距 */
  //   padding: 16rpx 28rpx;
  //   transition: transform 0.5s linear;
  //   // translate: translateY(0rpx);

  //   .nav_item {
  //     position: relative;
  //     flex: 0 0 auto; /* 禁止缩放/换行，确保可滚动 */
  //     height: 64rpx;
  //     padding: 16rpx 24rpx;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     font-size: 28rpx;
  //     color: $my-font-sub-color;
  //     border-radius: 32rpx;
  //     border: 2rpx solid $my-font-sub-color; /* 保持边框大小，避免切换时引起 reflow */
  //     box-sizing: border-box;
  //     transition: transform 150ms ease, border-color 150ms ease, color 150ms ease, background-color 150ms ease;
  //     transform: translateZ(0);
  //   }

  //   /* 可选：隐藏滚动条（web）*/
  //   .nav_box::-webkit-scrollbar {
  //     display: none;
  //   }

  //   .nav_item_act {
  //     /* 使用 transform 与边框颜色避免触发 reflow/relayout */
  //     transform: translateY(-4rpx);
  //     font-weight: 500;
  //     border-color: $tn-theme-color;
  //     color: $tn-theme-color;
  //     box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
  //     // background-size: 68rpx 24rpx;
  //   }
  // }
}

::v-deep  .tn-tabs__scroll-view__item {
  color: #999;
  padding: 0rpx 24rpx;
  border-radius: 32rpx;
  margin: 0 !important;
  margin-right: 16rpx !important;
  border: 2rpx solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
