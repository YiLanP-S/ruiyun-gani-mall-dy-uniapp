<template>
	<view class="oa-content">
		<view class="k-1">
			<view :class="['k-2',type==item.type?'active':'']" v-for="(item,index) in types" :key="index" @click="changType(item)">
				{{item.name}}
			</view>	
		</view>
		<view class="tn-padding-bottom-xl" style="padding-top: 100rpx;">
			<view class="k-3">
				<view class="b-24" v-for="(item,index) in list" :key="index">
					<view class="b-25">
						<image class="b-26" :src="item.userAvatar?item.userAvatar:'/static/tx_img.png'"></image>
					</view>
					<view class="b-27">
						<view class="b-28">
							<view class="b-29">
								<view class="b-30-box">
									<view class="b-30">{{item.userNickname?item.userNickname:'匿名用户'}}</view>
									<tn-rate v-model="item.scores" inactiveIcon="star-fill" activeColor="#ffca3e" :count="5" :size="24" :disabled="true"></tn-rate>
								</view>
								<view class="b-31">{{timestampToTime(item.createTime)}}</view>
							</view>
							<!-- <view class="b-32">
								<text class="tn-icon-praise" v-if="true"></text>
								<text class="tn-icon-praise-fill" v-else></text>
								<view class="b-33">890</view>
							</view> -->
						</view>
						<view class="b-34">{{item.content}}</view>
						<view class="b-35">
							<image class="b-36" v-for="(item1,index1) in item.picUrls" :key="index1" :src="item1" @click="previewImageList(item1,item.picUrls)"></image>
						</view>
						<view class="b-43" v-if="item.replyTime">
							<view class="b-44">商家回复：</view>
							<view class="b-45">{{ item.replyContent }}</view>
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
				types:[
					{name:'全部',type:0},
					{name:'满意',type:1},
					{name:'良好',type:2},
					{name:'欠佳',type:3}
				],
				timestampToTime,
				pageNo: 1,
				type:0,
				spuId:'',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '快速加载中...',
					nomore: '已经没有了啊'
				  },
				loadStatus:'loadmore',
				list:[],
			}
		},
		onLoad(options){
			if(options.spuId){
				this.spuId = options.spuId
				this.getlist()
			}
		},
		onShow() {
			// setTimeout(()=>{
			// 	this.showCountDown = true
			// })
			// console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
		},
		methods: {
			changType(item) {
			        this.type = item.type;
					this.pageNo=1;
					this.list=[];
					this.getlist();
			},
			getlist() {
				this.loadStatus = 'loading'
				console.log(this.loadStatus)
				let data = {
					pageNo: this.pageNo,
					pageSize: 20,
					type: this.type,
					spuId: this.spuId
				}
				let than = this;
				than.$http.getRequest('app-api/product/comment/page', data)
					.then(res => {
						if(res.code == 0){
							let list = res.data.list
							if (list.length > 0) {
								than.pageNo = than.pageNo + 1;
								list.forEach((item) => {
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
			// 预览图片
			previewImageList(url,urls){
				let that = this
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: urls, // 需要预览的图片http链接列表
				})
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
		// background-color: $tn-bg1-color;
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
.b-24{
	  display: flex;
	  justify-content: space-between;
  }
  .b-26{
	  width: 72rpx;
	  height: 72rpx;
	  border-radius: 100%;
  }
  .b-27{
	  width: 600rpx;
  }
  .b-28{
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
  }
  .b-30-box{
	  display: flex;
	  align-items: center;
  }
  .b-30{
	  font-size: $tn-font-title-color;
	  font-weight: bold;
	  margin-right: 10rpx;
  }
  .b-31{
	  color: $tn-middle-color;
	  font-size: 24rpx;
	  margin-top: 5rpx;
  }
  .b-32{
	  display: flex;
	  align-items: center;
  }
  .b-33{
	  margin-left: 10rpx;
  }
  .b-34{
	  margin-top: 20rpx;
  }
  .b-35{
	  margin-top: 10rpx;
	  font-size: 0;
  }
  .b-36{
	  width: 187rpx;
	  height: 187rpx;
	  border-radius: 16rpx;
	  margin-right: 20rpx;
	  margin-bottom: 20rpx;
  }
  .b-35 .b-36:nth-child(3n){
	  margin-right: 0;
  }
  .b-37{
		padding: 20rpx 30rpx;
		// background-color: $tn-bg1-color;
  }
  .b-38{
	  font-size: 33rpx;
	  font-weight: bold;
	  color: $tn-font-title-color;
  }
  .b-39{
	  font-size: 24rpx;
	  color: $tn-font-sub1-color;
	  margin-top: 10rpx;
  }
  .b-40{
		height: 74rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		margin-top: 20rpx;
		background-color: $tn-bg1-color;
	}
	.b-41{
		height: 100%;
		width: 550rpx;
		padding-right: 20rpx;
	}
	.b-42{
		padding-left: 25rpx;
		border-left: 1rpx solid #D9D9D9;
		color: $tn-font-sub1-color;
	}
	.b-13-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.b-43{
		display: flex;
		background-color: $tn-bg1-color;
		padding: 10rpx 20rpx;
		border-radius: 16rpx;
	}
	.b-44{
		flex-shrink: 0;
		color: $tn-font-sub1-color;
	}
	.b-45{
		margin-top: 5rpx;
	}
	.b-46{
		margin-left: 20rpx;
		display: flex;
	}
	.b-48{
		text-decoration: line-through;
	}
	.k-1{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100rpx;
		background-color: $tn-bg1-color;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
	}
	.k-2{
		height: 50rpx;
		padding: 0 20rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		margin-right: 20rpx;
	}
	.k-2.active{
		background-color: rgba(0, 89, 255, 0.1);
		color:  $tn-theme-color;
	}
	.k-3{
		padding: 0 30rpx;
		padding-top: 20rpx;
	}
</style>