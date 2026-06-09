<template>
	<view class="oa-content">
		<view>
			<view class="j-1">
				<view class="f-16">
					<image class="f-17" src="https://www.tmsglm.com/statics/tx_bg.png"></image>
					<view class="f-18">账户余额(元)</view>
					<view class="f-19">
						<view class="f-20">{{distributionInfo.brokeragePrice ? distributionInfo.brokeragePrice / 100 : 0}}</view>
						<view class="f-21" @click="tn('/pages/withdraw/withdraw?brokeragePrice='+(distributionInfo.brokeragePrice ? distributionInfo.brokeragePrice / 100 : 0))">
							提现
						</view>
					</view>
					<view class="f-40">
						<view class="f-41">总收益(元)<text class="f-42">{{syInfo.allBrokerage / 100}}</text></view>
						<view class="f-41">总支出(元)<text class="f-42">{{syInfo.outBrokerage / 100 * -1}}</text></view>
					</view>
				</view>
				<view class="b-0">
					<view class="b-1">
						<tn-tabs :list="fixedList" :current="current" :isScroll="false" activeColor="#0059FF"
							inactiveColor="#404040" :bold="true" backgroundColor="#FFFFFF" :fontSize="32" :badgeOffset="[20, 50]"
							@change="tabChange"></tn-tabs>
					</view>
				</view>
			</view>
		</view>
		<view class="j-2" :style="{height: `calc(100% - 410rpx)`}">
			<scroll-view scroll-y style="height: 100%;" @scrolltolower="scrolltolower">
				<view v-if="current==0">
					<view class="j-3" v-if="list.length>0">
						<view class="j-4" v-for="(item,index) in list" :key="index">
							<view class="j-5">
								<view class="j-6"><view class="j-15">{{item.month}}</view><view class="j-16"><view class="j-17">收益：￥{{parseFloat((item.inPrice / 100).toFixed(2))}}</view><view class="j-17">支出：￥{{parseFloat((item.outPrice / 100).toFixed(2))}}</view></view></view>
								<view class="j-7">
									<view class="j-8" v-for="(item1,index1) in item.brokerageRecordList" :key="index" @click="([4,5,6,7,8,9].includes(item1.bizType))?tn('/pages/order/distributionDetail?bizId='+item1.bizId):''">
										<view class="j-9">
											<image class="j-10" src="../../static/ztm_icon.png"></image>
											<view class="j-11">
												<view class="j-12">{{item1.title}}</view>
												<view class="j-13">{{timestampToTime(item1.createTime)}}</view>
											</view>
										</view>
										<view class="j-14"><view>{{item1.price>0?'+':''}}{{parseFloat((item1.price / 100).toFixed(2))}}</view> <text class="tn-icon-right j-18"></text></view>
									</view>
								</view>
							</view>
						</view>
						<tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
						<tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
						<tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
					</view>
				</view>
				<view v-if="current==1">
					<view class="j1-3" v-if="list.length>0">
							<view class="j1-4" v-for="(item,index) in list" :key="index">
								<view class="j1-5">
									<view>{{current==0?item.title:item.statusName}}</view>
									<view style="font-weight: 200;font-size: 24rpx;color: #999999;margin-top: 10rpx;">{{ item.createTime ? timestampToTime(item.createTime) : '' }}</view>
								</view>
								<view class="j1-6" v-if="item.price"><text :class="['j1-7',item.price<0?'j2-7':'']">{{item.price>0?'+':''}}{{ item.price / 100
					}}</text>元<view class="k-27" v-if="item.status==12" @click.stop="receivePayment(item)">确认收款</view></view>
							</view>
							<tn-load-more v-if="loadStatus == 'loadmore'" status="loadmore" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
							<tn-load-more v-if="loadStatus == 'loading'" status="loading" :loadText="loadText" fontColor="#0059FF"></tn-load-more>
							<tn-load-more v-if="loadStatus == 'nomore'" status="nomore" :loadText="loadText" fontColor="#999999"></tn-load-more>
						</view>
				</view>
				<view v-if="list.length==0" class="wu">
					 <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
				</view>
			</scroll-view>
		</view>
		<tn-tips ref="tips" position="center"></tn-tips>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import {timestampToTime} from '@/util/util.js'
	export default {
		name: 'TemplateSet',
		mixins: [template_page_mixin],
		data() {
			return {
				fixedList: [
					{
						name: '交易明细'
					},
					{
						name: '提现记录'
					}
				],
				current: 0,
				list:[],
				distributionInfo:{},
				pageNo: 1,
				loadText: {
					loadmore: '上拉加载更多',
					loading: '快速加载中...',
					nomore: '已经没有了啊'
				  },
				loadStatus:'loadmore',
				timestampToTime,
				syInfo:{
					allBrokerage: 0,
					outBrokerage: 0,
					productSaleBrokerage: 0,
					workBrokerage: 0
				}
			}
		},

		onShow() {
			this.getDistributionInfo()
			this.getlist()
			this.getSy()
		},
		methods: {
			getDistributionInfo() {
				let that = this
				that.$http.getRequest('app-api/trade/brokerage-user/get')
					.then(res => {
						if(res.code == 0){
							that.distributionInfo = res.data
						}else{
							that.$refs.tips.show({
							  msg: res.msg,
							  backgroundColor: '#E83A30',
							  fontColor: '#FFFFFF',
							  duration: 1500
							})
						}
					})
			},
			getlist() {
				this.loadStatus = 'loading'
				let than = this;
				// let data = {
				// 	pageNo: this.pageNo,
				// 	pageSize: 5
				// }
				let url = ''
				if(than.current==0){
					url = 'app-api/trade/brokerage-record/brokerage-page?pageNo='+than.pageNo+'&pageSize=5'
				}
				if(than.current==1){
					url = 'app-api/trade/brokerage-withdraw/page?pageNo='+than.pageNo+'&pageSize=20'
				}
				than.$http.getRequest(url)
				.then(res => {
					if(res.code == 0){
						let list = res.data.list
						if (list.length > 0) {
							than.pageNo = than.pageNo + 1;
							list.forEach((item) => {
								than.list.push(item)
							});
							console.log(than.list)
						}
						if(than.list.length<res.data.total){
							than.loadStatus = 'loadmore'
						}else{
							than.loadStatus = 'nomore'
						}
					}else{
						than.$refs.tips.show({
						  msg: res.msg,
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
					}
				})
			},
			getSy(){
				let that = this
				that.$http.getRequest('app-api/trade/brokerage-record/getAllBrokerage')
					.then(res => {
						if(res.code == 0){
							this.syInfo = res.data
						}else{
							that.$refs.tips.show({
								  msg: res.msg,
								  backgroundColor: '#E83A30',
								  fontColor: '#FFFFFF',
								  duration: 1500
								})
						}
					})	
			},
			scrolltolower(){
				this.getlist();
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			tabChange(e){
				this.current = e
				this.pageNo=1;
				this.list=[];
				this.getlist();
			},
			receivePayment(e){
				if (uni.canIUse('requestMerchantTransfer')) {
				  uni.requestMerchantTransfer({
				    mchId: '1701815539',
				    appId: 'wxd3746f05e423cb43',
				    package: JSON.parse(e.content).package_info,
				    success: (res) => {
				      // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
				      console.log('success:', res);
					  this.pageNo=1;
					  this.list=[];
					  this.getlist();
				    },
				    fail: (res) => {
				      console.log('fail:', res);
					  this.$refs.tips.show({
					  	  msg: res.errMsg,
					  	  backgroundColor: '#E83A30',
					  	  fontColor: '#FFFFFF',
					  	  duration: 1500
					  	})
				    },
				  });
				} else {
				  uni.showModal({
				    content: '你的微信版本过低，请更新至最新版本。',
				    showCancel: false,
				  });
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wu{
		padding-top: 25vh;
	}
	.oa-content {
		background-color: #F5F7FC;
		height: 100vh;
	}
	.f-16{
		height: 260rpx;
		border-radius: 16rpx;
		overflow: hidden;
		position: relative;
		// margin-top: 30rpx;
		padding: 0 20rpx;
	}
	.f-17{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.f-18{
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.5);
		position: relative;
		z-index: 1;
		padding-top: 56rpx;
	}
	.f-19{
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12rpx;
	}
	.f-20{
		font-size: 64rpx;
		color: white;
		font-weight: 700;
	}
	.h-15{
		width: 56rpx;
		height: 56rpx;
	}
	.h-16{
		margin-top: 5rpx;
		font-size: 26rpx;
	}
	.f-16{
		height: 220rpx;
		border-radius: 16rpx;
		overflow: hidden;
		position: relative;
		padding: 0 20rpx;
	}
	.f-17{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.f-18{
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.5);
		position: relative;
		z-index: 1;
		padding-top: 30rpx;
	}
	.f-19{
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12rpx;
	}
	.f-20{
		font-size: 64rpx;
		color: white;
		font-weight: 700;
	}
	.f-21{
		width: 188rpx;
		height: 72rpx;
		border-radius: 50rpx;
		background: rgba(255, 255, 255, 0.15);
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 600;
		color: white;
	}
	.f-40{
		position: relative;
		z-index: 1;
		display: flex;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 15rpx;
	}
	.f-41{
		padding: 0 20rpx;
		border-left: 1rpx solid rgba(255, 255, 255, 0.5);
		height: 25rpx;
		line-height: 25rpx;
	}
	.f-40 .f-41:first-child{
		padding-left: 0;
		border-left: none;
	}
	.f-42{
		color: white;
		font-weight: bold;
		margin-left: 10rpx;
	}
	/* 底部悬浮按钮 end*/
	/deep/ .tn-tabs-class{
		background-color: transparent !important;
	}
	/deep/ .tn-tabs__scroll-view__item{
		flex: initial !important;
		margin-right: 50rpx;
	}
	/deep/ .tn-tabs__scroll-view--flex{
		justify-content: left !important;
	}
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.b-0{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}
	.b-1{
		width: 70%;
	}
	.j-1{
		padding:0 30rpx;
		padding-top: 30rpx;
	}
	.j-2{
		padding: 0 30rpx;
		// margin-top: 20rpx;
	}
	.j-3{
		padding-bottom: 30rpx;
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
		justify-content: space-between;
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
		margin-left: 20rpx;
	}
	.j-12{
		font-weight: bold;
		color: $tn-font-title-color;
	}
	.j-13{
		font-size: 24rpx;
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
	}
	.j-14{
		font-size: 32rpx;
		font-weight: bold;
		color: $tn-font-title-color;
		display: flex;
		align-items: center;
	}
	.j-15{
		font-size: 32rpx;
		font-weight: bold;
		color: $tn-font-title-color;
	}
	.j-16{
		display: flex;
		font-size: 24rpx;
		font-weight: bold;
	}
	.j-17{
		margin-left: 20rpx;
	}
	.j-18{
		font-weight: initial;
		font-size: 28rpx;
		margin-left: 10rpx;
		display: none;
	}
	.k-27{
		width: 150rpx;
		height: 62rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color:  $tn-theme-color;
		color: white;
		border-radius: 50rpx;
		margin-left: 20rpx;
	}
</style>