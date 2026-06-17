<template>
	<view class="oa-content">
		<view class="j-1">
			<tn-tabs :list="types" :isScroll="true" :current="current" name="name" @change="change" inactiveColor="#7A8499" activeColor="#0059FF"></tn-tabs>
		</view>
		<view class="tn-padding-bottom-xl" style="padding-top: 100rpx;">
			<view class="j-2">
				<view class="j-3" v-for="(item,index) in list" :key="index" @click="tn('./distributionDetail?id='+item.id)">
					<view class="j-4">
						<view class="j-5">订单号：{{item.no}}</view>
						<view class="j-6">{{formatOrderStatus(item)}}</view>
					</view>
					<view class="c-15-box">
						<view class="c-15" v-for="item1 in item.items" :key="item1.id">
							<image class="c-16" :src="item1.picUrl"></image>
							<view class="c-17">
								<view class="c-18">{{item1.spuName}}</view>
								<view class="c-19-box">
									<view class="c-19" v-for="(item2,index2) in item1.properties" :key="index2">{{item2.propertyName+':'+item2.valueName}}<text>/</text></view>
								</view>
								<view class="c-20">
									<view class="c-21"><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item1.price / 100).toFixed(2)) }}</text></view>
									<!-- <view class="c-22">x{{item1.count / 10000}}m²</view> -->
								</view>
							</view>
						</view>
					</view>
					<view class="j-7-box">
						<view class="j-7">
							<view class="j-8">订单金额:</view>
							<view class="j-9">￥{{ parseFloat((item.totalPrice / 100).toFixed(2)) }}</view>
						</view>
						<view class="j-7">
							<view class="j-8">分销佣金:</view>
							<view class="j-9">￥{{ parseFloat((item.distributorPrice / 100).toFixed(2)) }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="margin-top: 30rpx;" v-if="list.length>0">
				<tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
				<tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
			</view>
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
				types:[
					{name:'全部',status:''},
					{name:'待付款',status:0},
					{name:'待派单',status:22},
					{name:'待上门',status:23},
					{name:'待施工',status:24},
					{name:'待验收',status:25},
					{name:'待付余款',status:28},
					{name:'已完成',status:30},
				],
				current:0,
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
				let data = {
					pageNo: this.pageNo,
					pageSize: 6,
					status:this.status,
					commentStatus: this.status === 30 ? false : ''
				}
				let than = this;
				than.$http.getRequest('app-api/trade/order/distributorPage', data)
					.then(res => {
						if(res.code == 0){
							let list = res.data.list
							if (list.length > 0) {
								than.pageNo = than.pageNo + 1;
								list.forEach((item) => {
									this.handleOrderButtons(item)
									than.list.push(item)
								});
							}
							if(than.list.length<res.data.total){
								than.loadStatus = 'loadmore'
							}else{
								than.loadStatus = 'nomore'
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
			onReachBottom(){
				this.getlist();
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			// 验收
			onCheck(id){
				this.id = id
				this.checkInfo.show = true
			},
			clickCheck(e){
				if(e.index == 0){
					this.checkInfo.show = false
				}
				if(e.index == 1){
					this.$http.getRequest('app-api/trade/work/checkAndAccept/'+this.id)
					.then(res => {
						if(res.code == 0){
							this.checkInfo.show = false
							this.$refs.toast.show({
							  title: '验收成功',
							  icon: 'success',
							  image: '',
							  duration: 1000
							})
							this.change(6)
						}else{
							this.checkInfo.show = false
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
			onFinishPay(finishPayOrderId){
				let that = this
				that.$http.getRequest('app-api/pay/order/get',{
					id:finishPayOrderId
				}).then(res => {
						if(res.code == 0){
							that.$http.postRequest('app-api/pay/order/submit',{
								id: res.data.id,
								channelCode: 'wx_lite',
								channelExtras: {
									openid:uni.getStorageSync('openid'),
									payType:"1"
								}
							}).then(res => {
									if(res.code == 0){
										// console.log(res)
										// 调用微信小程序支付
										let payConfig = JSON.parse(res.data.displayContent);
										uni.requestPayment({
										  provider: 'wxpay',
										  timeStamp: payConfig.timeStamp,
										  nonceStr: payConfig.nonceStr,
										  package: payConfig.packageValue,
										  signType: payConfig.signType,
										  paySign: payConfig.paySign,
										  success: (res) => {
										    that.$refs.toast.show({
										      title: '支付成功',
										      icon: 'success',
										      image: '',
										      duration: 1000
										    })
										    this.change(7)
										  },
										  fail: (err) => {
										    if (err.errMsg === 'requestPayment:fail cancel') {
												 that.$refs.toast.show({
												   title: '支付取消',
												   icon: 'close',
												   image: '',
												   duration: 1000
												 })
										    } else {
												  that.$refs.toast.show({
													title: '支付失败',
													icon: 'close',
													image: '',
													duration: 1000
												  })
										    }
										  },
										});
									}else{
										this.$refs.tips.show({
										  msg: res.msg,
										  backgroundColor: '#E83A30',
										  fontColor: '#FFFFFF',
										  duration: 1500
										})
									}
								})
						}else{
							this.$refs.tips.show({
								  msg: res.msg,
								  backgroundColor: '#E83A30',
								  fontColor: '#FFFFFF',
								  duration: 1500
								})
						}
					})	
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		border-bottom: 1px solid  $tn-border-solids-color;
	}
	.j-5{
		color: $tn-font-sub1-color;
	}
	.j-6{
		color: $tn-theme-color;
	}
	.j-7-box{
		display: flex;
		justify-content: flex-end;
		border-top:  1px solid  $tn-border-solids-color;
	}
	.j-7{
		display: flex;
		justify-content: flex-end;
		padding: 20rpx 0;
		margin-left: 20rpx;
	}
	.j-9{
		color: $tn-theme-color;
		font-weight: bold;
		font-size: 30rpx;
	}
	.j-10{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-top:  1px solid  $tn-border-solids-color;
		padding: 20rpx 0;
	}
	.j-11{
		font-size: 24rpx;
		display: flex;
		align-items: center;
	}
	.j-11 text{
		margin-left: 10rpx;
		color: $tn-theme-color;
	}
	.j-11 ::v-deep  .tn-countdown__item__time{
		font-size: 24rpx !important;
	}
	.j-11 ::v-deep  .tn-countdown__separator{
		font-size: 24rpx !important;
		color: $tn-theme-color !important;
	}
	.j-12{
		display: flex;
	}
	::v-deep  .j-12 .tn-btn{
		margin-left: 20rpx;
		width: 100% !important;
	}
	::v-deep  .j-12 tn-button:first-child .tn-btn{
		margin-left: 0;
	}
	.j-13{
		margin-right: 10rpx;
	}
</style>