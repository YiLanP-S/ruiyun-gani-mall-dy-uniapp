<template>
	<view class="oa-content">
		<view class="j-1">
			<tn-tabs :list="status" :isScroll="false" :current="current" name="name" @change="change" inactiveColor="#7A8499" activeColor="#0059FF"></tn-tabs>
		</view>
		<view class="tn-padding-bottom-xl" style="padding-top: 100rpx;">
			<view class="n-1">
				<view :class="['n-2',item.status>1?'disabeld':'']" v-for="(item,index) in list" :key="index">
					<view class="n-3">
						<view class="n-4">100</view>
						<view class="n1-4">优惠券(元)</view>
					</view>
					<view class="n-5">
						<view class="n-6">
							<view class="n-7">满500元减100元</view>
							<view class="n-8">有效期至:2024.09.01</view>
						</view>
						<tn-button :backgroundColor="item.status>1?'#7A8499':'#0059FF'" fontColor="#ffffff">{{item.name}}</tn-button>
					</view>
				</view>
			</view>
		</view>
		<tn-tips ref="tips" position="center"></tn-tips>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import customerNotice from "@/components/customerNotice";
	import {timestampToTime} from '@/util/util.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		data() {
			return {
				status:[
					{name:'全部'},
					{name:'未使用'},
					{name:'已使用'},
					{name:'已过期'}
				],
				current:0,
				list:[
					{status:1,name:'去使用'},
					{status:1,name:'去使用'},
					{status:2,name:'已使用'},
					{status:3,name:'已过期'},
					{status:1,name:'去使用'},
					{status:1,name:'去使用'},
					{status:2,name:'已使用'},
					{status:3,name:'已过期'},
					{status:1,name:'去使用'},
					{status:1,name:'去使用'},
					{status:2,name:'已使用'},
					{status:3,name:'已过期'}
				]
			}
		},
		onLoad(options){
			this.detail = JSON.parse(options.detail)
			console.log('detail',this.detail)
		},
		onShow() {
			setTimeout(()=>{
				this.showCountDown = true
			})
			console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
		},
		methods: {
			toHome(){
				uni.switchTab({
				  url: '/pages/index/index'
				})
			},
			customerNoticeShow(){
				this.customerNoticeVisible = true
			},
			customerNoticeClose(){
				this.customerNoticeVisible = false
			},
			contactCustomers(){
				this.customerNoticeVisible = false
				let that = this
				uni.makePhoneCall({
				  phoneNumber: that.detail.customerPhone,
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
			viewOrder(){
				uni.redirectTo({ url: '/pages/task/detail?id='+this.detail.id })
			},
			change(index) {
			        this.current = index;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wu{
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
		color: #FFFFFF;
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
		color: #1D2541;
		background-color: #1D2541;
	}

	.oa-blue {
		color: #4B98FE;
		background-color: #4B98FE;
	}

	.oa-orangeyellow {
		color: #FFAC00;
		background-color: #FFAC00;
	}

	.oa-green {
		color: #00D05E;
		background-color: #00D05E;
	}

	.oa-orange {
		color: #FE871B;
		background-color: #FE871B;
	}

	.oa-cyan {
		color: #00C8B0;
		background-color: #00C8B0;
	}

	.oa-indigo {
		color: #00B9FE;
		background-color: #00B9FE;
	}

	.oa-orangered {
		color: #FB6A67;
		background-color: #FB6A67;
	}

	.oa-purple {
		color: #957BFE;
		background-color: #957BFE;
	}
	.oa-dark {
		color: #AAAAAA;
		background-color: #E6E6E6;
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
		background-color: #FFFFFF;
		margin-top:30rpx;
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
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.j-1{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		background-color: $tn-bg1-color;
	}
	.n-1{
		padding: 0 30rpx;
	}
	.n-2{
		background-color: white;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		height: 184rpx;
		overflow: hidden;
	}
	.n-3{
		width: 184rpx;
		background-color: $tn-theme-color;
		color: white;
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	.n-3:before{
		display: block;
		content: '';
		width: 20rpx;
		height: 20rpx;
		border-radius: 100%;
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background-color: white;
	}
	.n-3::after{
		display: block;
		content: '';
		width: 20rpx;
		height: 20rpx;
		border-radius: 100%;
		position: absolute;
		bottom: -10rpx;
		right: -10rpx;
		background-color: white;
	}
	.n-2.disabeld{
		opacity: 0.7;
	}
	.n-2.disabeld .n-3{
		background-color: $tn-middle-color;
	}
	.n-4{
		font-size: 56rpx;
		font-weight: bold;
		padding-top: 40rpx;
	}
	.n1-4{
		color: rgba(245, 245, 245, 1);
		font-size: 24rpx;
	}
	.n-5{
		width: calc(100% - 184rpx);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.n-7{
		font-size: 32rpx;
	}
	.n-8{
		font-size: 24rpx;
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
	}
</style>