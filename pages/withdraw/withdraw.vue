<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 120rpx)':'120rpx'}">
		<view class="tn-padding-bottom-xl">
			<view class="h-1">
				<view class="h-2">
					<view class="h-3">
						<view class="h-4">提现至</view>
						<view class="h-5">
							<text class="tn-icon-circle-fill"></text>
							微信
						</view>
					</view>
					<view class="h-6">提现金额</view>
					<view class="h-7">
						<view class="h-8">￥</view>
						<view class="h-9">
							<input type="digit" :focus="isFfocus" v-model="amount" />
						</view>
					</view>
					<view class="h-10">
						当前可提现余额{{brokeragePrice}}元，<text class="h-11" @click="allFund">全部提现</text>
					</view>
					<tn-button class="tn-button" backgroundColor="#0059FF" shape="round" padding="40rpx 0" width="100%" :fontSize="28"
						fontColor="#FFFFFF" @click="tixian">
						<text class="">提现</text>
					</tn-button>
				</view>
				<view class="h-12">
					<view class="h-13">温馨提示</view>
					<view class="h-14">
						<text class="h-15">
							1、单笔提现金额需要大于等于100元，小于等于2000元；\n2、提现费率为微信官方收取：0.1%（平台不收取任何提现手续费）；\n3、提现需要经过平台后台审核，24小时内到账，请注意核准；\n4、提现佣金保留两位小数；\n5、经平台审核通过后，请24小时内进入“简一膜法”小程序“提现记录”页面，确认收款；
						</text>
					</view>
				</view>
			</view>
		</view>
		<tn-tips ref="tips" position="center"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	export default {
		name: 'TemplateIntegral',
		mixins: [template_page_mixin],
		data() {
			return {
				userData: {},
				title:"立即提现",
				content:"提现金额：200元",
				show: false,
				show1: false,
				list: [],
				button: [{
						text: '取消',
						backgroundColor: '#E6E6E6',
						fontColor: '#555555',
						plain: true,
						shape: 'round'
					},
					{
						text: '确定',
						backgroundColor: 'tn-bg-indigo',
						fontColor: '#FFFFFF'
					}
				],
				isFfocus:true,
				
				brokeragePrice:0,
				amount:'',

			}
		},
		onLoad(options) {
			this.brokeragePrice = options.brokeragePrice

		},
		methods: {
			showPicker(event) {
				this.show = true
			},
			open() {
				 let pay=this.userData.pay;
				 if(pay<=200){
					 if(pay>=1){
						this.amount=pay;
						this.content="提现金额："+pay+"元"; 
						this.show1 = true;
					 }else{
						this.$refs.tips.show({
						   msg: '余额不足1元，不可提现',
						   backgroundColor: '#E83A30',
						   fontColor: '#FFFFFF',
						   duration: 1500
						 })
					 }
					 
				 }else{
					 this.amount=200
					 this.content="提现金额：200元";
					 this.show1 = true;
				 }
				// 
			  },
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			allFund(){
				if(this.brokeragePrice==0){
					this.$refs.tips.show({
					   msg: '没有可提现的余额',
					   backgroundColor: '#E83A30',
					   fontColor: '#FFFFFF',
					   duration: 1500
					 })
					 return
				}
				this.amount = JSON.parse(JSON.stringify(this.brokeragePrice))
			},
			tixian(){
				if(this.amount==''){
					this.$refs.tips.show({
					   msg: '提现金额不能为空',
					   backgroundColor: '#E83A30',
					   fontColor: '#FFFFFF',
					   duration: 1500
					 })
					 return
				}
				if(this.amount<100||this.amount>2000){
					this.$refs.tips.show({
					   msg: '单笔提现金额需大于等于100元小于等于2000',
					   backgroundColor: '#E83A30',
					   fontColor: '#FFFFFF',
					   duration: 1500
					 })
					 return
				}
				if(this.amount*1>this.brokeragePrice*1){
					this.$refs.tips.show({
					   msg: '可提现余额不足',
					   backgroundColor: '#E83A30',
					   fontColor: '#FFFFFF',
					   duration: 1500
					 })
					 return
				}
					this.$http.postRequest('app-api/trade/brokerage-withdraw/create', {
							type: 3,
							price: this.amount * 100,
						})
						.then(res => {
							if(res.code==0){
								 this.$refs.toast.show({
								   title: '提现成功',
								   icon: 'success',
								   image: '',
								   duration: 1500
								 })
								 uni.navigateBack()
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
	.oa-content {
		background-color: #F8F7F8;
		min-height: 100vh;
		padding-bottom: 60rpx;
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
		padding-bottom: 120rpx;
	}
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.h-1{
		padding: 30rpx;
	}
	.h-2{
		background-color: white;
		padding: 20rpx;
		border-radius: 16rpx;
	}
	.h-3{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.h-5{
		display: flex;
		align-items: center;
	}
	.h-5 text{
		color: $tn-theme-color;
		margin-right: 10rpx;
	}
	.h-6{
		color: $tn-middle-color;
		margin-top: 20rpx;
	}
	.h-7{
		display: flex;
		align-items: center;
		margin-top: 15rpx;
		border-bottom: 1px solid #D9D9D9;
		padding-bottom: 10rpx;
	}
	.h-8{
		font-size: 40rpx;
		color: $tn-font-title-color;
		font-weight: bold;
	}
	.h-9{
		margin-left: 15rpx;
		color: $tn-font-title-color;
		font-weight: bold;
		font-size: 64rpx;
	}
	.h-9 input{
		height: 80rpx;
	}
	.h-10{
		color: $tn-middle-color;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	.h-11{
		color: $tn-theme-color;
	}
	/deep/ .tn-button button{
		margin-top: 30rpx;
		background: linear-gradient(130.69deg, #0059FF 0%, #004AD4 100%);
		// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
	}
	.h-12{
		margin-top: 30rpx;
	}
	.h-13{
		color: $tn-dot-color;
	}
	.h-14{
		margin-top: 20rpx;
		line-height: 50rpx;
		font-size: 24rpx;
	}
</style>