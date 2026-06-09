<template>
	<view class="oa-content">
		<view class="tn-padding-bottom-xl" style="padding-top: 20rpx;">
			<view class="j-2">
				<view class="j-4" v-for="(item,index) in list" :key="index">
					<view class="j-5">
						<view class="j-6">
							<image :src="item.avatar" class="j-21"></image>
							<view class="j-20">
								<view class="j-15">{{item.customerName}}</view>
								<view class="j-22">{{item.customerPhone}}</view>
							</view>
						<!-- <view class="j-16"><view class="j-17">收益：￥{{parseFloat((item.inPrice / 100).toFixed(2))}}</view><view class="j-17">支出：￥{{parseFloat((item.outPrice / 100).toFixed(2))}}</view></view> -->
						</view>
						<view class="j-7">
							<view class="j-8" v-for="(item1,index1) in item.workList" :key="index" @click="tn('./distributionDetail?id='+item1.orderId)">
								<view class="j-9">
									<!-- <image class="j-10" :src="item1.picUrl"></image> -->
									<view class="j-11">
										<view class="j-12">订单编号：{{item1.orderNo}}</view>
										<view class="j-13">{{timestampToTime(item1.createTime)}}</view>
									</view>
								</view>
								<view class="j-14"><view>分销佣金：<text style="color: #0059FF;font-weight: bold;">￥{{(item1.distributorPrice / 100).toFixed(2)}}</text></view> <text class="tn-icon-right j-18"></text></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		<!-- 	<view class="" style="margin-top: 30rpx;" v-if="list.length>0">
				<tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
			</view> -->
			<view v-if="list.length==0" class="wu">
				 <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
			</view>
		</view>
		<tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
		<tn-modal v-model="checkInfo.show" :title="checkInfo.title" :content="checkInfo.content" :button="checkInfo.button" @click="clickCheck"></tn-modal>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import customerNotice from "@/components/customerNotice";
	import {timestampToTime,formatOrderStatus,handleOrderButtons} from '@/util/util.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		data() {
			return {
				timestampToTime,
				formatOrderStatus,
				handleOrderButtons,
				// timestamp: 86400,
				pageNo: 1,
				status:'',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '快速加载中...',
					nomore: '已经没有了啊'
				  },
				loadStatus:'loadmore',
				list:[],
				checkInfo:{
					show:false,
					title: '提示',
					content: '是否验收？',
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
				  id:''
			}
		},
		onLoad(options){
			if(options.status){
				this.status = options.status*1
				this.types.forEach((item,index) => {
					if(item.status === this.status){
						this.current = index
					}
				})
			}
		},
		onShow() {
			// setTimeout(()=>{
			// 	this.showCountDown = true
			// })
			// console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
			this.getlist()
		},
		methods: {
			change(index) {
			        this.current = index;
					this.status = this.types[index].status
					this.list = []
					this.pageNo = 1
					this.getlist()
			},
			getlist() {
				this.loadStatus = 'loading'
				console.log(this.loadStatus)
				// let data = {
				// 	pageNo: this.pageNo,
				// 	pageSize: 10,
				// 	status:this.status,
				// 	commentStatus: this.status === 30 ? false : ''
				// }
				let than = this;
				than.$http.getRequest('app-api/trade/work/distributorWorkList')
					.then(res => {
						if(res.code == 0){
							than.list = res.data
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
			// onReachBottom(){
			// 	this.getlist();
			// },
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			}

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
	.c-15{
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
	}
	.c-16{
		width: 176rpx;
		height: 176rpx;
		border-radius: 8rpx;
	}
	.c-17{
		width: 430rpx;
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
		color: $tn-font-sub1-color;
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
	.j-1{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
		background-color: $tn-bg1-color;
	}
	.j-2{
		padding: 0 30rpx;
	}
	.j-3{
		background-color: white;
		border-radius: 8rpx;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
	}
	.j-4{
		border-radius: 12rpx;
		background: #FFFFFF;
		padding: 20rpx;
		margin-bottom: 20rpx;
		// border: 1rpx solid $tn-border-dashed-color;
	}
	.j-6{
		display: flex;
		// justify-content: space-between;
		align-items: center;
	}
	.j1-1{
		padding:0 30rpx;
		padding-top: 30rpx;
	}
	.j1-2{
		padding: 0 30rpx;
	}
	.j1-3{
		padding-bottom: 30rpx;
	}
	.j1-4{
		height: 112rpx;
		border-radius: 16rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid $tn-border-dashed-color;
	}
	.j1-5{
		color: $tn-font-title-color;
		font-weight: bold;
	}
	.j-6{
		border-bottom: 1rpx solid $tn-border-dashed-color;
		padding-bottom: 20rpx;
	}
	.j1-6{
		color:$tn-font-sub1-color;
		display:flex;
		align-items: center;
	}
	.j1-7{
		color: $tn-theme-color;
		font-size: 40rpx;
	}
	.j2-7{
		color: $tn-font-title-color;
	}
	.j-8{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;
	}
	.j-9{
		display: flex;
		align-items: center;
	}
	.j-10{
		width: 80rpx;
		height: 80rpx;
		border-radius: 100%;
	}
	.j-11{
		// margin-left: 20rpx;
	}
	.j-12{
		font-weight: bold;
		color: $tn-font-title-color;
		font-size: 24rpx;
	}
	.j-13{
		font-size: 24rpx;
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
	}
	.j-14{
		font-size: 26rpx;
		font-weight: bold;
		color: $tn-font-title-color;
		display: flex;
		align-items: center;
	}
	.j-15{
		font-size: 30rpx;
		font-weight: bold;
	}
	.j-20{
		margin-left: 20rpx;
		display: flex;
		align-items: center;
	}
	.j-21{
		height: 60rpx;
		width: 60rpx;
		border-radius: 100%;
	}
	.j-22{
		// margin-top: 10rpx;
		color: $tn-font-sub1-color;
		margin-left: 20rpx;
	}
</style>