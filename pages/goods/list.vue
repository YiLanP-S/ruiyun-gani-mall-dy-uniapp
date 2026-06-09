<template>
  <view class="oa-content">
    <view class="a-0" :style="{ height: vuex_custom_bar_height + 'px' }">
      <tn-nav-bar :isBack="true" backgroundColor="transparent" :backTitle="backTitle">
        <view class="a-1" style="display: flex; align-items: center; width: 90%">
          <view class="m-2">
            <view class="m-3-box">
              <view class="m-6">
                <text class="tn-icon-search m-7"></text>
                <tn-input height="30" type="text" confirmType="search" v-model="keywords" class="m-8" @confirm="search" placeholder="请输入关键字" />
              </view>
            </view>
          </view>
        </view>
      </tn-nav-bar>
    </view>
    <view class="m-1" :style="{ top: vuex_custom_bar_height + 'px' }">
      <tn-tabs :isSort="true" :isHome="true" :list="fixedList" :current="current" :isScroll="false" activeColor="#0059FF" inactiveColor="#404040" :bold="true" backgroundColor="#FFFFFF" :badgeOffset="[20, 50]" @change="tabChange"> </tn-tabs>
    </view>
    <view class="tn-padding-bottom-xl" :style="{ paddingTop: `calc(${vuex_custom_bar_height}px + 110rpx)` }">
      <view class="n-1">
        <view class="n-2 n1-2">
          <my-goodInfo :list="list" v-if="list.length > 0"></my-goodInfo>
          <!-- <view class="a-15" v-for="(item, index) in list" :key="index" @click="tn('/pages/goods/detail?id=' + item.id)">
            <image class="a-16" :src="item.picUrl"></image>
            <view class="a-17">
              <view class="a-18">{{ item.name }}</view>
              <view class="a-19">
                <view class="a-20">
                  <view class="a-21"
                    ><text>{{ parseFloat((item.price / 100).toFixed(2)) }} </text>
                  </view>
                </view>
                <image class="a-23" src="../../static/right_img.png"></image>
              </view>
            </view>
          </view> -->
        </view>
        <!-- 				<view class="n-2" v-if="current==1">
					<view class="a-24" v-for="(item1,index1) in list" :key="index1">
						<image class="a-25" src="../../static/sl.jpg"></image>
						<view class="a-26">
							<view class="a-27">厨房台面保护膜...</view>
							<view class="a-28">
								<view class="a-29">满1000减300</view>
							</view>
							<view class="a-30">
								<view class="a-31">已售 300+</view>
								<view class="a-32"><text class="a-33">￥</text><text class="a-34">60</text><text class="a-35">/㎡</text></view>
							</view>
						</view>
					</view>
				</view> -->
        <view class="" style="margin-top: 30rpx" v-if="list.length > 0">
          <tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
          <tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
          <tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
        </view>
        <view v-if="list.length == 0" class="wu">
          <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
        </view>
      </view>
    </view>
    <tn-tips ref="tips" position="center"></tn-tips>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import customerNotice from '@/components/customerNotice'
import { timestampToTime } from '@/util/util.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  data() {
    return {
      // listType: ['上门贴膜', '膜材市场'],
      fixedList: [
        {
          name: '综合推荐',
        },
        {
          name: '价格',
          sortField: 'price',
          sort: 'asc',
          sortAsc: true,
        },
        {
          name: '销量',
          sortField: 'salesCount',
        },
        {
          name: '新品优先',
        },
      ],
      current: 0,
      backTitle: '',
      list: [],
      keywords: '',
      categoryId: '',
      pageNo: 1,
      loadText: {
        loadmore: '上拉加载更多',
        loading: '快速加载中...',
        nomore: '已经没有了啊',
      },
      loadStatus: 'loadmore',
    }
  },
  onLoad(options) {
    if (options.keywords) {
      this.keywords = options.keywords
    }
    if (options.categoryId) {
      this.categoryId = options.categoryId
    }
    this.getlist()
  },
  onShow() {},
  methods: {
    tabChange(e) {
      this.current = e
      if (this.current == 1) {
        this.fixedList[1].sort = this.fixedList[1].sort == 'desc' ? 'asc' : 'desc'
        this.fixedList[1].sortAsc = !this.fixedList[1].sortAsc
      }
      this.pageNo = 1
      this.list = []
      this.getlist()
    },
    search() {
      this.pageNo = 1
      this.list = []
      this.getlist()
    },
    getlist() {
      this.loadStatus = 'loading'
      console.log(this.loadStatus)
      let data = {}
      if (this.current == 0) {
        data = {
          pageNo: this.pageNo,
          pageSize: 20,
          sourceType: 2,
          keyword: this.keywords,
          categoryId: this.categoryId,
        }
      } else if (this.current == 1) {
        data = {
          pageNo: this.pageNo,
          pageSize: 20,
          sourceType: 2,
          sortField: 'price',
          sortAsc: this.fixedList[1].sortAsc,
          keyword: this.keywords,
          categoryId: this.categoryId,
        }
      } else if (this.current == 2) {
        data = {
          pageNo: this.pageNo,
          pageSize: 20,
          sourceType: 2,
          sortField: 'salesCount',
          sortAsc: false,
          keyword: this.keywords,
          categoryId: this.categoryId,
        }
      } else if (this.current == 3) {
        data = {
          pageNo: this.pageNo,
          pageSize: 20,
          sourceType: 2,
          sortAsc: false,
          keyword: this.keywords,
          categoryId: this.categoryId,
        }
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
    onReachBottom() {
      this.getlist()
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
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: white;
}
/deep/ .tn-tabs-class {
  background-color: transparent !important;
}
/deep/ .tn-bg-white {
  background-color: transparent !important;
}
/deep/ .tn-custom-nav-bar__bar {
  box-shadow: none !important;
}
/deep/ .tn-subsection__item {
  width: 150rpx;
  height: 52rpx;
}
/deep/ .tn-subsection-class {
  height: 52rpx !important;
}
.a-1 {
  display: flex;
  padding: 0 30rpx;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
}
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
  background-color: white;
  min-height: 100vh;
  padding-bottom: 60rpx;
  padding-bottom: env(safe-area-inset-bottom) / 2;
  padding-bottom: constant(safe-area-inset-bottom);
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
/deep/ .tn-btn-class {
  white-space: nowrap;
}
.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.a-15 {
  width: 335rpx;
  height: 198rpx;
  position: relative;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  margin-right: 20rpx;
}
.n-2 .a-15:nth-child(2n) {
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
.a-24 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
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
.m-1 {
  padding: 20rpx 30rpx;
  padding-top: 0;
  background-color: white;
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 10;
}
.m-2 {
  background-color: $tn-bg1-color;
  // padding: 10rpx;
  border-radius: 50rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.m-3-box {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
}
.m-3 {
  display: flex;
  align-items: center;
  border-right: 1rpx solid $tn-font-sub1-color;
  padding-right: 20rpx;
}
.m-4 {
  max-width: 150rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 100rpx;
}
.m-6 {
  display: flex;
  align-items: center;
}
.m-7 {
  margin-right: 10rpx;
  margin-left: 20rpx;
  line-height: 60rpx;
}
.m-8 {
  font-size: 24rpx;
}
.n-1 {
  // padding: 0 30rpx;
  background: $tn-space-color;
}
.n1-2 {
  display: flex;
  flex-wrap: wrap;
}
/deep/ .tn-custom-nav-bar__bar__content {
  margin-left: 60rpx;
}
/deep/ .tn-custom-nav-bar__bar__action {
  display: none;
}
</style>
