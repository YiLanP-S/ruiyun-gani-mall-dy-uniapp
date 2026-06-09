<template>
	<view class="oa-content">
	<!-- 	<view class="a-0" :style="{height: safeAreaBottomt + 'px'}">
			<tn-nav-bar :isBack="false" backgroundColor="#F5F7FC">
				<view class="a-1" style="display: flex;">
					<view class="a-3" style="font-weight: bold;font-size: 32rpx;color: black;">
						品类
					</view>
				</view>
			</tn-nav-bar>
		</view> -->
		<view class="tn-padding-bottom-xl" style="padding-bottom: 0;">
			<view class="f-1" :style="{height:`calc(100vh - 100rpx - ${safeAreaBottom}px)`}">
				<scroll-view class="f-2" scroll-y>
					<view class="f-3">
						<view :class="['f-4',parentId==item.id?'active':'']" v-for="(item,index) in classifications" :key="index" @click="changeClass(item.id)">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
				<scroll-view class="f-5" scroll-y>
					<!-- <view class="f-6" v-if="current==0">
						<view class="a-15" v-for="(item,index) in types" :key="index">
							<image class="a-16" :src="item.img"></image>
							<view class="a-17">
								<view class="a-18">{{item.title}}</view>
								<view class="f-7">耐磨 / 防刮 / 防油污</view>
								<view class="a-19">
									<view class="a-20">
										<view class="a-21"><text>{{item.money}}</text>元起</view>
										<view class="a-22">上门</view>
									</view>
									<image class="a-23" src="../../static/right_img.png"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="f-6" v-if="current==1">
						<view class="a-24" v-for="(item1,index1) in 10" :key="index1">
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
					<view class="f-22" v-if="types.length>0">
						<view class="f-23" v-for="(item,index) in types" :key="index" @click="tn('/pages/goods/list?categoryId='+item.id)">
							<image class="f-24" :src="item.picUrl"></image>
							<view class="f-25">{{item.name}}</view>
						</view>
					</view>
					<view v-if="types.length==0" class="wu">
						 <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<tn-tips ref="tips" position="center"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
		<tn-tabbar
		  v-model="currentIndex"
		  :list="tabbarList"
		  activeColor="#838383"
		  inactiveColor="#AAAAAA"
		  activeIconColor="#0059FF"
		  :animation="true"
		  :safeAreaInsetBottom="true"
		  @change="switchTabbar"
		></tn-tabbar>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import {timestampToTime} from '@/util/util.js'
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
		      return `calc(${this.vuex_custom_bar_height}px + 80rpx)`;  
		    }  
		  }, 
		data() {
			return {
				listType: ['上门贴膜', '膜材市场'],
				// 底部tabbar菜单数据
				// tabbar当前被选中的序号
				currentIndex: 1,
				parentId:0,
				classifications:[],
				allTypes:[],
				types:[],
				safeAreaBottom:0
			}
		},
		onHide(){
			
		},
		onLoad(options){
			const { screenHeight, safeArea } = uni.getSystemInfoSync();
			console.log(safeArea)
			console.log(screenHeight)
			this.safeAreaBottom = screenHeight - safeArea.bottom;
			console.log(options)
			console.log(options.scene)
			console.log(decodeURIComponent(options.scene).split('=')[1])
			if(options.scene){
			  store.commit('$tStore', {
			  	name: 'distribution_code',
			  	value: decodeURIComponent(options.scene).split('=')[1]
			  })
			}
			this.getlist()
		},
		onShow() {
			this.currentIndex = 1
		},
		methods: {
			// tab选项卡切换
			// tabChange(index) {
			// 	this.current = index;
			// 	this.status = this.fixedList[index].status
			// 	this.pageNo=1
			// 	this.list=[]
			// 	this.getlist()
			// },
			changeType(e){
				this.current = e.index
				// this.pageNo=1
				// this.list=[]
				// this.getlist()
			},
			getlist() {
				let than = this;
				than.$http.getRequest('app-api/product/category/list', {})
					.then(res => {
						if(res.code == 0){
							than.classifications = res.data.length>0?res.data.filter((item,index) => item.parentId==0):[],
							than.allTypes = res.data.length>0?res.data.filter((item,index) => item.parentId!=0):[]
							than.parentId = than.classifications[0].id
							than.changeClass(than.parentId)
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
			switchTabbar(e,pagePath){
				console.log(e)
				this.currentIndex = e
				uni.switchTab({
					url:pagePath
				})
			},
			changeClass(id){
				this.parentId = id
				this.types = this.allTypes.filter((item,index) => item.parentId==this.parentId)
			},
			// 跳转
			tn(e) {
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
		background-color: $tn-bg1-color;
		min-height: 100vh;
		// padding-bottom: 60rpx;
		// padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
		// padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
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
		background-color: #FFFFFF;
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
	
	
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		background-color: white;
	}
	/deep/ .tn-tabs-class{
		background-color: transparent !important;
	}
	/deep/ .tn-bg-white{
		background-color: transparent !important;
	}
	/deep/ .tn-custom-nav-bar__bar{
		box-shadow: none !important;
	}
	/deep/ .tn-subsection__item{
		width: 150rpx;
		height: 52rpx;
	}
	/deep/ .tn-subsection-class{
		// height: 52rpx !important;
	}
	.a-1{
		display: flex;
		padding: 0 30rpx;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
	}
	.a-15{
		width: 100%;
		height: 312rpx;
		position: relative;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	.a-16{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.a-17{
		position: relative;
		z-index: 1;
		padding-left: 20rpx;
		padding-top: 50rpx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background-color: rgba(255, 255, 255, 0.2);
	}
	.a-18{
		font-size: 32rpx;
		color: $tn-font-title-color;
		font-weight: bold;
	}
	.a-19{
		width: 240rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid $tn-theme-color;
		border-radius: 50rpx;
		margin-top: 70rpx;
		font-size: 24rpx;
	}
	.a-20{
		display: flex;
		align-items: center;
		padding-left: 20rpx;
	}
	.a-21{
		color: $tn-theme-color;
	}
	.a-21 text{
		color: $tn-theme-color;
		font-weight: bold;
		font-size: 28rpx;
	}
	.a-22{
		color: $tn-middle-color;
	}
	.a-23{
		width: 40rpx;
		height: 40rpx;
	}
	.a-24{
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}
	.a-24-box .a-24:last-child{
		margin-bottom: 0;
	}
	.a-26{
		width: 485rpx;
		margin-left: 20rpx;
	}
	.a-25{
		width: 178rpx;
		height: 178rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}
	.a-26{
		position: relative;
	}
	.a-27{
		color: $tn-font-title-color;
		font-size: 30rpx;
		font-weight: bold;
	}
	.a-28{
		display: flex;
		margin-top: 10rpx;
		flex-wrap: wrap;
	}
	.a-29{
		font-size: 24rpx;
		background-color: #FFEBE6;
		color: $tn-dot-color;
		border-radius: 8rpx;
		margin-right: 20rpx;
		padding: 0 10rpx;
	}
	.a-30{
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.a-32{
		font-size: 24rpx;
	}
	.a-33{
		font-weight: bold;
	}
	.a-34{
		color: $tn-theme-color;
		font-size: 34rpx;
		font-weight: bold;
	}
	.f-1{
		// margin-top: 20rpx;
		display: flex;
	}
	.f-2{
		width: 25%;
		height: 100%;
	}
	.f-4{
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 30rpx;
		position: relative;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.f-4.active{
		color: $tn-theme-color;
		font-weight: bold;
		background-color: white;
	}
	.f-4:before{
		display: none;
		position: absolute;
		content: '';
		width: 4rpx;
		height: 30rpx;
		border-radius: 20rpx;
		background-color: $tn-theme-color;
		top: 0;
		bottom: 0;
		left: 0;
		margin: auto;
	}
	.f-4.active:before{
		display: block;
	}
	.f-5{
		width: 75%;
		height: 100%;
		background-color: white;
	}
	.f-6{
		padding: 0 20rpx;
		padding-bottom: 50rpx;
	}
	.f-7{
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
	}
	.f-24{
		width: 147rpx;
		height: 147rpx;
	}
	.f-22{
		display: flex;
		flex-wrap: wrap;
		padding: 30rpx;
	}
	.f-23{
		width: 147rpx;
		margin-right: 30rpx;
		text-align: center;
		margin-bottom: 30rpx;
	}
	.f-22 .f-23:nth-child(3n){
		margin-right: 0;
	}
	.f-25{
		margin-top: 10rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>