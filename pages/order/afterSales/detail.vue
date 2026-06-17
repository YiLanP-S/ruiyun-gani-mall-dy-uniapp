<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 120rpx)':'120rpx'}">
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
					<!-- {{formatOrderStatus(detail)}} -->
					  <tn-steps activeColor="#0059FF" :list="list" mode="icon" :current="current"></tn-steps>
				</view>
<!-- 				<view class="d-4">
					<tn-button class="d-5" width="100%" backgroundColor="#0059FF" :plain="true" fontColor="#0059FF" shape="round">取消订单</tn-button>
					<tn-button class="d-6" width="100%" backgroundColor="#0059FF" shape="round" fontColor="#ffffff">立即支付</tn-button>
				</view> -->
				<view class="c-2">
					<view class="c-15">
						<image class="c-16" :src="detail.picUrl"></image>
						<view class="c-17">
							<view class="c-18">{{detail.spuName}}</view>
							<view class="c-19-box">
								<view class="c-19" v-for="(item1,index1) in detail.properties" :key="index1">{{item1.propertyName+':'+item1.valueName}}<text>/</text></view>
							</view>
							<view class="c-20">
								<view class="c-21"><text class="c-23">￥</text><text class="c-24">{{ parseFloat((detail.refundPrice / 100).toFixed(2)) }}</text></view>
							</view>
						</view>
					</view>
				</view>
				<view class="c-2">
					<view class="c-26-box" style="margin-top: 0;">
						<view class="c-26">
							<view class="c-27">订单编号</view>
							<view class="c-28">
							{{ detail.no }}
							<view class="c1-31" @click="copy(detail.no)">复制</view>
							</view>
						</view>
						<view class="c-26">
							<view class="c-27">申请时间</view>
							<view class="c-28">{{ timestampToTime(detail.createTime) }}</view>
						</view>
						<view class="c-26">
							<view class="c-27">相关描述</view>
							<view class="c-28">{{ detail.applyReason }}</view>
						</view>
						<view class="c-26" v-if="detail.applyPicUrls.length>0">
							<view class="c-27">相关图片</view>
							<view class="c-28 c2-28">
								<image class="c-84" :src="item" v-for="item in detail.applyPicUrls" :key="item" @click="previewImages(item)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>	
		<!-- 悬浮按钮-->
		<view class="tn-flex tn-footerfixed tn-padding" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 20rpx)':''}">
			
			<view class="tn-flex tn-flex-1 justify-content-item tn-text-center c-38">
				<tn-button class="tn-button c-39 c1-39" shape="round" :plain="true" backgroundColor="#7A8499" fontColor="#7A8499" padding="40rpx 0" width="100%" :fontSize="28" v-if="detail.buttons.includes('cancel')" @click="onCancel" >
					<text class="">取消申请</text>
				</tn-button>
				<tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28"
					fontColor="#FFFFFF">
					<button open-type="lifeIm" style="width: 100%;padding: 0;margin: 0;font-size: 28rpx;color: white;border-radius: 50rpx;">联系客服</button>
				</tn-button>
			</view>
		
		</view>
	
		<tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
		<tn-modal v-model="cancelInfo.show" :title="cancelInfo.title" :content="cancelInfo.content" :button="cancelInfo.button" @click="clickCancel"></tn-modal>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import {timestampToTime,handleAfterSaleButtons} from '@/util/util.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		data() {
			return {
				id:'',
				detail:{
					buttons:[],
					securityImages:'',
					applyPicUrls:[]
				},
				logs:'',
				handleAfterSaleButtons,
				timestampToTime,
				fileList:[],
				security:'',
				cancelInfo:{
					show:false,
					title: '提示',
					content: '是否取消申请？',
					button: [{
						text: '取消',
						backgroundColor: '#E6E6E6',
						fontColor: '#FFFFFF',
						shape: 'round'
					  },
					  {
						text: '确定',
						backgroundColor: '#0059FF',
						fontColor: '#FFFFFF'
					  }
					]
				  },
				  
				  list: [{
				    name: '提交申请',
					icon:'success-circle-fill'
				  }, {
				    name: '处理中',
					icon:'success-circle-fill'
				  }, {
				    name: '完成',
					icon:'success-circle-fill'
				  }], 
				  current: 1,
			}
		},
		onLoad(options){
			if(options.id){
				this.id = options.id
				this.getDetail()
			}
		},
		onShow() {
			
		},
		methods: {
			getDetail(){
				this.fileList = []
				this.$http.getRequest('app-api/trade/after-sale/get',{
					id:this.id
				})
				.then(res => {
					if(res.code == 0){
						this.detail = res.data
						this.handleAfterSaleButtons(this.detail)
						// 处理时间轴
						if ([10].includes(this.detail.status)) {
							  this.current = 1;
							} else if ([20, 30].includes(this.detail.status)) {
							  this.current = 2;
							} else if ([40, 50].includes(this.detail.status)) {
							  this.current = 3;
							} else if ([61, 62, 63].includes(this.detail.status)) {
							  this.current = 3;
							  this.list[2].name="取消"
							  this.list[2].icon="close-fill"
							}
					}else{
						this.$refs.tips.show({
							  msg: res.msg,
							  backgroundColor: '#E83A30',
							  fontColor: '#FFFFFF',
							  duration: 1500
							})
					}
				})
			},
			//拨打电话
			callPhone(){
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
					  duration: 1500
					})
			    },
			  })
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
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
			  });
			},
			previewImages(url){
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: this.detail.applyPicUrls // 需要预览的图片http链接列表
				})
			},
			// 取消
			onCancel(){
				this.cancelInfo.show = true
			},
			clickCancel(e){
				if(e.index == 0){
					this.cancelInfo.show = false
				}
				if(e.index == 1){
					this.$http.deleteRequest('app-api/trade/after-sale/cancel',{
						id:this.id
					})
					.then(res => {
						if(res.code == 0){
							this.cancelInfo.show = false
							this.$refs.toast.show({
							  title: '取消成功',
							  icon: 'success',
							  image: '',
							  duration: 1000
							})
							this.getDetail()
						}else{
							this.cancelInfo.show = false
							this.$refs.tips.show({
								  msg: res.msg,
								  backgroundColor: '#E83A30',
								  fontColor: '#FFFFFF',
								  duration: 1500
								})
						}
					})
				}
			},
		}
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
	.a-0{
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
		
		.image-banner{
		  display: flex;
		  align-items: center;
		  justify-content: center;
		}
		.image-banner image{
		  width: 100%;
		  height: 100%;
		}
		
		/* 轮播指示点 start*/
		.indication{
		  z-index: 9999;
		  width: calc(100% - 100rpx);
		  height: 36rpx;
		  position: absolute;
		  display:flex;
		  flex-direction:row;
		  align-items:center;
		  justify-content:center;
		}
		
		.spot{
		  background-color: #FFFFFF;
		  opacity: 0.4;
		  width: 10rpx;
		  height: 10rpx;
		  border-radius: 20rpx;
		  top: -60rpx;
		  margin: 0 8rpx !important;
		  position: relative;
		}
		
		.spot.active{
		  opacity: 0.6;
		  width: 30rpx;
		  background-color: #FFFFFF;
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
		
		::v-deep  .tn-button button{
			background: linear-gradient(130.69deg, #0059FF 0%, #004AD4 100%);
			// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
		}
		::v-deep  .c1-39.tn-button button{
			background: white;
			// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
		}
		// ::v-deep  .tn-icon-close-fill{
		// 	font-size: 40rpx !important;
		// 	color: $tn-font-title-color !important;
		// }
		/* 底部悬浮按钮 end*/
		::v-deep  .time-line-item__content__time{
			color: #a29e9e;
			font-size: 24rpx;
			margin-top: 10rpx;
		}
	.c-2{
		padding: 20rpx;
		background-color: white;
		border-radius: 8rpx;
		margin-top: 20rpx;
	}
	.c-13{
		display: flex;
		justify-content: center;
	}
	.c-14 ::v-deep  .tn-image-upload__item{
		background-color: transparent !important;
		width: 640rpx !important;
		height: 400rpx !important;
		margin: 0 !important;
		border-radius: 16rpx;
		border: 1rpx dashed $tn-border-solids-color;
	}
	.c-15{
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}
	.c-2 .c-15:last-child{
		margin-bottom: 0;
	}
	.c-16{
		width: 176rpx;
		height: 176rpx;
		border-radius: 8rpx;
	}
	.c-17{
		width: 450rpx;
		position: relative;
	}
	.c-18{
		color:  $tn-font-title-color;
		font-size: 30rpx;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.c-19-box{
		display: flex;
		flex-wrap: wrap;
		margin-top: 10rpx;
	}
	.c-19{
		font-size: 24rpx;
		color:  $tn-font-sub1-color;
	}
	.c-19-box .c-19:last-child text{
		display: none;
	}
	.c-20{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.c-21{
		color: $tn-theme-color;
	}
	.c-23{
		font-size: 24rpx;
	}
	.c-24{
		font-weight: bold;
	}
	.c-25{
		padding: 20rpx 0;
		border-bottom: 1rpx solid $tn-border-solids-color;
		color: $tn-font-title-color;
		font-size: 30rpx;
		padding-top: 0;
		font-weight: bold;
		display: flex;
		align-items: center;
	}
	.c-26-box{
		margin-top: 20rpx;
	}
	.c-26{
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.c1-26{
		padding: 20rpx 0;
		border-top: 1rpx solid $tn-border-solids-color;
		border-bottom: 1rpx solid $tn-border-solids-color;
	}
	.c-27{
		color: $tn-font-sub1-color;
		display: flex;
		align-items: center;
	}
	.c-27 text{
		margin-left: 10rpx;
	}
	.c-28{
		display: flex;
		align-items: center;
		max-width: 510rpx;
	}
	.c-28 text{
		margin-left: 10rpx;
	}
	.c1-28{
		font-size: 24rpx;
	}
	.c2-28{
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
	}
	.c2-28{
		color: $tn-theme-color;
	}
	.c-29{
		display: flex;
		justify-content: flex-end;
	}
	.c-31{
		color: $tn-theme-color;
		font-weight: bold;
	}
	.c1-31{
		height: 35rpx;
		border-radius: 16rpx;
		background: #F7F8F9;
		display: flex;
		align-items: center;
		padding: 0 15rpx;
		background: #F7F8F9;
		color: $tn-theme-color;
		margin-left: 10rpx;
	}
	.c-32{
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		border-top: 1rpx solid $tn-border-solids-color;
	}
	.c-33{
		color: $tn-font-sub1-color;
	}
	.c-34{
		width: 560rpx;
		margin-left: 20rpx;
	}
	.c-35{
		flex: 2;
		display: flex;
		align-items: center;
	}
	.c-36{
		color: $tn-theme-color;
		font-weight: bold;
	}
	.c-36 text{
		font-weight: initial;
		font-size: 24rpx
	}
	.c-38{
		width: 100%;
		gap: 20rpx; 
	}
	.c-39{
		flex: 1;
	}
	
	.d-1{
		padding: 30rpx;
	}
	.d-2{
		color: $tn-theme-color;
		font-size: 32rpx;
		font-weight: bold;
	}
	.d-2 text{
		color: $tn-font-title-color;
	}
	.d-3{
		display: flex;
		margin-top: 20rpx;
	}
	.d-4{
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}
	.d-5{
		flex: 1;
		margin-right: 20rpx;
	}
	.d-6{
		flex: 1;
	}
	.d-11-box{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.d-11{
		display: flex;
		align-items: center;
	}
	.d-12{
		width: 96rpx;
		height: 96rpx;
		border-radius: 100%;
	}
	.d-13{
				margin-left: 20rpx;
	}
	.d-14{
		font-weight: bold;
		color:  $tn-font-title-color;
	}
	.d-15{
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
	}
	.d-16{
		margin-right: 10rpx;
	}
	.d-16 text{
		font-weight: bold;
		color:  $tn-font-title-color;
		margin: 0 10rpx;
	}
	.d-17{
		color: $tn-font-sub1-color;
		font-size: 24rpx;
		border-left: 1rpx solid $tn-border-solids-color;
		font-weight: initial;
		margin-left: 20rpx;
		padding-left: 20rpx;
	}
	.d-19{
		margin-top: 20rpx;
	}
	.d-20{
		display: flex;
		justify-content: flex-end;
		width: 100%;
		margin-top: -110rpx;
		margin-right: 30rpx;
	}
	.d-21{
		font-weight: bold;
	}
	.d-21-box{
		background-color: rgba(0, 0, 0, 0.2);
		color: white;
		border-radius: 50rpx;
		padding: 0 10rpx;
		display: flex;
		align-items: center;
	}
	
	.c-56{
		padding: 0 30rpx;
		height: 100%;
	}
	.c-57{
		font-size: 32rpx;
		color: $tn-font-title-color;
		text-align: center;
		font-weight: bold;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.c-58-box{
		overflow-y: auto;
		// padding-bottom: 30rpx;
		box-sizing: border-box;
	}
	.c1-58{
		margin-left: -30rpx;
		width: calc(100% + 60rpx);
		background-color: #F7F8F9;
	}
	.c-58{
		border-radius: 8rpx;
		background: #F7F8F9;
		padding: 20rpx;
		color: $tn-middle-color;
	}
	.c-59{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 30rpx;
	}
	.c-60{
		font-size: 24rpx;
	}
	.c-61 .tn-radio-group-class tn-radio:last-child ::v-deep  .tn-radio__label{
		margin-right: 0 !important;
	}
	.c-62{
		display: flex;
		align-items: center;
		border-radius: 6rpx;
		background: #F7F8F9;
		padding-right: 15rpx;
	}
	.c-63{
		width: 150rpx;
		padding: 0 15rpx;
		box-sizing: border-box;
		height: 60rpx;
		text-align: center;
	}
	.c-64{
		border-left: 1rpx solid $tn-middle-color;
		padding-left: 10rpx;
	}
	.c-65{
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
	.c-66{
		display: flex;
		align-items: center;
	}
	.c-67{
		color: $tn-dot-color;
		font-weight: bold;
	}
	.c-68{
		font-size: 40rpx;
	}
	.c-69{
		width: 342rpx;
	}
	.c-70{
		display: flex;
		align-items: center;
		color: $tn-theme-color;
		font-size: 24rpx;
		margin-left: 20rpx;
	}
	.c-71{
		margin-left: 10rpx;
	}
	.c-72{
		padding: 30rpx;
		padding-top: 90rpx;
	}
	.c-73{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	.c-74{
		color: $tn-middle-color;
	}
	.c-76{
		width: calc(100% + 60rpx);
		margin-left: -30rpx;
		border-top: 1rpx solid #D6D6D6;
	}
	.c-78-box{
		white-space: nowrap;
	}
	.c-78{
		display: inline-flex;
		width: 112rpx;
		height: 98rpx;
		justify-content: center;
		align-items: center;
		color: $tn-middle-color;
		text-align: center;
	}
	.c-78.active{
		background-color: #F7F8F9;
		color: $tn-theme-color;
	}
	.c-80-box{
		padding: 30rpx;
	}
	.c1-80-box{
		display: flex;
		flex-wrap: wrap;
		gap: 25rpx;
	}
	.c-80{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 214rpx;
		height: 110rpx;
		border-radius: 16rpx;
		border: 1rpx solid #00091A;
		text-align: center;
	}
	.c-80.active{
		background-color: $tn-theme-color;
		color: white;
		// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
		border-color: $tn-theme-color;
	}
	.c-81{
		font-weight: bold;
		color: $tn-font-title-color;
	}
	.c-80.active .c-81{
		color: white;
	}
	.c-82{
		font-size: 24rpx
	}
	.c-84{
		width: 150rpx;
		height: 150rpx;
	}
</style>