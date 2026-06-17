<template>
	<view class="oa-content">
		<view class="m-1">
			<view class="m-2">
				<view class="m-3-box">
					<!-- <view class="m-3">
						<view class="m-4">武汉</view>
						<text class="tn-icon-down-triangle m-5"></text>
					</view> -->
					<view class="m-6">
						<text class="tn-icon-search m-7"></text>
						<input class="m-8" v-model="keywords" placeholder="请输入关键字"/>
					</view>
				</view>
				<tn-button backgroundColor="#0059FF" fontColor="#ffffff" shape="round" @click="search">搜索</tn-button>
			</view>
		</view>
		<view class="tn-padding-bottom-xl" style="margin-top: 40rpx;">
			<view class="m-9">
				<view class="m-10">
					<view class="m-11">历史搜索</view>
					<text class="tn-icon-delete m-12" @click="handleRemove"></text>
				</view>
				<view class="m-13">
					<view class="m-14" v-for="(item,index) in keywordsList" :key="index" @click="tn('./list?keywords='+item)">{{item}}</view>
				</view>
			</view>
		</view>
		<tn-tips ref="tips" position="center"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
		<tn-modal v-model="deleteInfo.show" :title="deleteInfo.title" :content="deleteInfo.content" :button="deleteInfo.button" @click="clickDelete"></tn-modal>
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
				keywords:'',
				keywordsList:[],
				deleteInfo:{
					show:false,
					title: '提示',
					content: '是否清除历史搜索？',
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
			}
		},
		onLoad(options){
			// this.detail = JSON.parse(options.detail)
			// console.log('detail',this.detail)
		},
		onShow() {
			this.keywordsList = uni.getStorageSync('keywordsList')?uni.getStorageSync('keywordsList'):[]
		},
		methods: {
			search(){
				if(this.keywords==''){
					console.log(this.$refs.tips)
					this.$refs.tips.show({
						  msg: '关键字不能为空',
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
					return
				}
				if(this.keywordsList.length<=0){
					this.keywordsList = [this.keywords]
					uni.setStorageSync('keywordsList', [this.keywords])
				}else{
						if(!this.keywordsList.includes(this.keywords)){
							this.keywordsList.push(this.keywords)
							uni.setStorageSync('keywordsList', this.keywordsList)
						}
				}
				this.tn('./list?keywords='+this.keywords)
			},
			// 删除地址
			handleRemove() {
					  this.deleteInfo.show = true
			},
			clickDelete(e){
				if(e.index == 0){
					this.deleteInfo.show = false
				}
				if(e.index == 1){
						this.deleteInfo.show = false
						uni.removeStorageSync('keywordsList')
						this.keywordsList = []
						this.$refs.toast.show({
						  title: '已清除',
						  icon: 'success',
						  image: '',
						  duration: 1500
						})
				}
			},
			// 跳转
			tn(e){
				uni.navigateTo({
					url: e,
				});
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
		background-color: white;
		min-height: 100vh;
		padding-bottom: 60rpx;
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
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
	::v-deep  .tn-btn-class{
		white-space: nowrap;
	}
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	
	.m-1{
		padding: 0 30rpx;
		padding-top: 20rpx;
	}
	.m-2{
		background-color: $tn-bg1-color;
		padding: 10rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.m-3-box{
		display: flex;
		align-items: center;
		margin-right: 20rpx;
		width: 500rpx;
	}
	.m-3{
		display: flex;
		align-items: center;
		border-right: 1rpx solid $tn-font-sub1-color;
		padding-right: 20rpx;
	}
	.m-4{
		max-width: 150rpx;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 100rpx;
	}
	.m-6{
		display: flex;
		align-items: center;
	}
	.m-7{
		margin-right: 10rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		flex-shrink: 0;
	}
	.m-8{
		width: 500rpx;
	}
	.m-9{
		padding: 0 30rpx;
	}
	.m-10{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.m-11{
		font-size: 30rpx;
		font-weight: bold;
		color:  $tn-font-title-color;
	}
	.m-12{
		font-size: 33rpx;
	}
	.m-13{
		margin-top: 40rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.m-14{
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		border: 1px solid rgba(242, 242, 242, 1);
		border-radius: 50rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
</style>