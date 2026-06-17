<template>
	<view class="oa-content">
		<view class="tn-padding-bottom-xl">
			<view class="g-1">
				<view class="g-2" v-if="cartList.length>0">
					<view class="g-3">
						<!-- <tn-tabs :list="types" :isScroll="false" :current="current" name="name" @change="change" inactiveColor="#7A8499" activeColor="#0059FF"></tn-tabs> -->
						共
						<text>{{ cartList.length }}</text>
						件商品
					</view>
					<!-- <text class="tn-icon-delete g-4"></text> -->
					<view :class="['g1-4',isDelete?'g2-4':'']" @click="isDelete = !isDelete">{{isDelete?'取消':'编辑'}}</view>
				</view>
				<view class="g-5" v-if="cartList.length>0">
					<tn-checkbox-group v-model="ids" @change="checkboxGroupChange" shape="circle">
						<view class="g-6" v-for="(item,index) in cartList" :key="index">
							<tn-checkbox activeColor="#0059FF" :name="item.id" @change="checkboxChange"></tn-checkbox>
							<view class="g-7">
								<image class="g-8" :src="item.spu.picUrl"></image>
								<view class="g-9">
									<view class="g-10">{{item.spu.name}}</view>
									<view class="g-11">
										<view class="g1-11" v-for="(item1,index1) in item.sku.properties" :key="index1">{{item1.propertyName+':'+item1.valueName}}<text>/</text></view>
									</view>
									<view class="g-12">
										<view class="g-13">￥<text>{{ parseFloat((item.sku.price / 100).toFixed(2)) }}</text>
										<!-- 元/次起 -->
										</view>
										<tn-number-box v-model="item.count" :min="1" :step="0.1" backgroundColor="#F5F7FC" :positiveInteger="false" @minus="changeCart(item)" @plus="changeCart(item)" @blur="changeCart(item)"></tn-number-box>
									</view>
								</view>
							</view>
						</view>
					</tn-checkbox-group>
				</view>
				<view class="g-14" :style="{bottom:`calc(140rpx + env(safe-area-inset-bottom))`}" v-if="cartList.length>0">
					<view class="g-15">
						<tn-checkbox v-model="isAll" shape="circle" activeColor="#0059FF" @change="checkboxAllChange">全选</tn-checkbox>
					</view>
					<view class="g-16">
						<view class="g-17">合计：<text>￥{{ parseFloat(totalPriceSelected.toFixed(2)) }}</text></view>
						<tn-button backgroundColor="#0059FF" width="150rpx" fontColor="#ffffff" shape="round" @click="isDelete?deleteGoods():buy()">{{isDelete?'删除':'去下单'}}</tn-button>
					</view>
				</view>
				<view v-if="cartList.length==0" class="wu">
					 <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
				</view>
			</view>
		</view>
		<tn-modal v-model="deleteInfo.show" :title="deleteInfo.title" :content="deleteInfo.content" :button="deleteInfo.button" @click="clickDelete"></tn-modal>
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
	  import store from '../../store/index.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		data() {
			return {
				// tabbar当前被选中的序号
				currentIndex: 3,
				types: [{
				  name: '上门贴膜'
				}, {
				  name: '膜材市场'
				}],
				current: 0,
				isAll:true,
				totalPriceSelected:0,
				isDelete:false,
				ids:[],
				deleteInfo:{
					show:false,
					title: '提示',
					content: '是否删除选中的商品？',
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
		watch: {
		
			ids: {
			
			handler(newVal, oldVal) {
			
			console.log(newVal)
			// 处理变化
			
				if(newVal.length == this.cartList.length){
					this.isAll = true
				}else{
					this.isAll = false
				}
			
			},
			
			deep: true
			
			}
		
		},
		onLoad(options){
			console.log(options)
			console.log(options.scene)
			console.log(decodeURIComponent(options.scene).split('=')[1])
			if(options.scene){
			  store.commit('$tStore', {
			  	name: 'distribution_code',
			  	value: decodeURIComponent(options.scene).split('=')[1]
			  })
			}
			this.ids = []
			// this.detail = JSON.parse(options.detail)
			// console.log('detail',this.detail)
			if(this.cartList.length>0){
				this.cartList.forEach((item,index) => {
					this.ids.push(item.id)
				})
			}else{
				this.ids = []
			}
		},
		onShow() {
			this.currentIndex = 3
			console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
			if(this.cartList.length>0){
				this.totalPriceSelected = 0
				this.cartList.forEach((item,index) => {
					this.ids.forEach((item1,index1) => {
						if(item.id == item1){
							this.totalPriceSelected += item.count * item.sku.price / 100;
						}
					})
				})
			}else{
				this.totalPriceSelected = 0
			}
		},
		methods: {
			toHome(){
				uni.switchTab({
				  url: '/pages/index/index'
				})
			},
			change(index) {
			        this.current = index;
			},
			checkboxGroupChange(e){
				console.log(e)
			},
			switchTabbar(e,pagePath){
				console.log(e)
				this.currentIndex = e
				uni.switchTab({
					url:pagePath
				})
			},
			changeCart(item){
				console.log(item)
				let that = this
				that.$http.putNewRequest('app-api/trade/cart/update-count',{
							  id: item.id,
							  count: item.count*10000
				})
					.then(res => {
						if(res.code == 0){
							that.$http.getRequest('app-api/trade/cart/list')
								.then(res => {
									if(res.code == 0){
										let validList = res.data.validList
										if(validList.length>0){
											validList.forEach((item,index) => {
												let count = parseFloat((item.count / 10000).toFixed(2))
												item.count = count
											})
										}
										store.commit('$tStore', {
											name: 'cartList',
											value: validList
										})
										if(this.cartList.length>0){
											this.totalPriceSelected = 0
											this.cartList.forEach((item,index) => {
												this.ids.forEach((item1,index1) => {
													if(item.id == item1){
														this.totalPriceSelected += item.count * item.sku.price / 100;
													}
												})
											})
										}else{
											this.totalPriceSelected = 0
										}
									}else{
										that.$refs.tips.show({
										  msg: res.msg,
										  backgroundColor: '#E83A30',
										  fontColor: '#FFFFFF',
										  duration: 1500
										})
									}
								})
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
			checkboxGroupChange(e){
				console.log('e',e)
				this.ids = e
				if(this.cartList.length>0){
					this.totalPriceSelected = 0
					this.cartList.forEach((item,index) => {
						this.ids.forEach((item1,index1) => {
							if(item.id == item1){
								this.totalPriceSelected += item.count * item.sku.price / 100;
							}
						})
					})
				}else{
					this.totalPriceSelected = 0
				}
			},
			checkboxChange(e){
				// this.cartList.forEach((item,index)=>{
				// 	if(item.id == e.name){
				// 		item.isSelected = e.value
				// 	}
				// })
				// console.log(e)
			},
			checkboxAllChange(e){
				this.ids = []
				if(e.value){
					if(this.cartList.length>0){
						this.totalPriceSelected = 0
						this.cartList.forEach((item,index) => {
							this.totalPriceSelected += item.count * item.sku.price / 100;
							this.ids.push(item.id)
						})
					}else{
						this.totalPriceSelected = 0
						this.ids = []
					}
				}else{
					if(this.cartList.length>0){
						this.totalPriceSelected = 0
						this.ids = []
					}else{
						this.totalPriceSelected = 0
						this.ids = []
					}
				}
			},
			deleteGoods(){
				console.log(this.ids)
				if(this.ids.length<=0){
					this.$refs.tips.show({
						  msg: '请先选择商品',
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
						return
				}
				this.deleteInfo.show = true
			},
			clickDelete(e){
				if(e.index == 0){
					this.deleteInfo.show = false
				}
				if(e.index == 1){
					this.deleteInfo.show = false
					this.$http.deleteRequest('app-api/trade/cart/delete',{
						ids:this.ids.join(',')
					})
						.then(res => {
							if(res.code == 0){
								this.$refs.toast.show({
								  title: '删除成功',
								  icon: 'success',
								  image: '',
								  duration: 1500
								})
								this.$http.getRequest('app-api/trade/cart/list')
									.then(res => {
										if(res.code == 0){
											let validList = res.data.validList
											if(validList.length>0){
												validList.forEach((item,index) => {
													let count = parseFloat((item.count / 10000).toFixed(2))
													item.count = count
												})
											}
											store.commit('$tStore', {
												name: 'cartList',
												value: validList
											})
											this.ids = []
											this.totalPriceSelected = 0
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
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			buy(){
				if(this.ids.length<=0){
					this.$refs.tips.show({
						  msg: '请先选择商品',
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
						return
				}
				let items = [];
				let selectedList = this.cartList.filter((item) => this.ids.includes(item.id));
				selectedList.map((item) => {
				  // 此处前端做出修改
				  items.push({
				    skuId: item.sku.id,
				    count: item.count*10000,
				    skuLength:item.skuLength,
				    skuWidth:item.skuWidth,
				    cartId: item.id,
				  });
				});
				this.tn('/pages/goods/confirm?data='+encodeURIComponent(JSON.stringify({
							 items,
							 // TODO 芋艿：后续清理掉这 2 参数
							 deliveryType: 1,
							 pointStatus: false,
				})))
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
	.tn-padding-bottom-xl{
		padding-bottom: 100rpx;
	}
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.g-1{
		padding: 0 30rpx;
		padding-top: 80rpx;
	}
	.g-2{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #F5F7FC;
		position: fixed;
		top: 0;
		left: 30rpx;
		width: calc(100% - 60rpx);
		z-index: 10;
	}
	.g-3{
		width: 50%;
		height: 80rpx;
		display: flex;
		align-items: center;
	}
	.g-3 text{
		color: $tn-theme-color;
	}
	.g-4{
		font-size: 35rpx;
	}
	.g1-4{
		color: $tn-theme-color;
	}
	.g2-4{
		color: $tn-font-sub1-color;
	}
	.g-5{
		margin-top: 20rpx;
	}
	.g-6{
		background-color: white;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		display: flex;
		align-items: center;
	}
	.g-7{
		display: flex;
		width: calc(100% - 68rpx);
	}
	.g-8{
		width: 176rpx;
		height: 176rpx;
		border-radius: 4rpx;
		flex-shrink: 0;
	}
	.g-9{
		margin-left: 20rpx;
		position: relative;
		width: calc(100% - 196rpx);
	}
	.g-10{
		color: $tn-font-title-color;
		font-weight: bold;
	}
	.g-11{
		font-size: 24rpx;
		color: $tn-font-sub1-color;
		margin-top: 10rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.g-11 .g1-11:last-child text{
		display: none;
	}
	::v-deep  .g-6 .tn-number-box__btn--disabled{
		background: #F5F7FC !important;
	}
	.g-12{
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
	}
	.g-13{
		color: $tn-theme-color;
		font-size: 24rpx;
	}
	.g-13 text{
		font-weight: bold;
		font-size: 28rpx;
	}
	.g-14{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 10rpx;
		border-radius: 50rpx;
		padding-left: 20rpx;
	}
	.g-16{
		display: flex;
		align-items: center;
	}
	.g-17{
		margin-right: 40rpx;
		color: $tn-font-sub1-color;
	}
	.g-17 text{
		font-weight: bold;
		color: $tn-theme-color;
		font-size: 28rpx;
	}
	.g-14{
		position: fixed;
		left: 30rpx;
		width: calc(100% - 60rpx);
		background-color: white;
		z-index: 10;
		box-shadow: 0 0 10rpx 5rpx rgba(0, 0, 0, 0.05);
	}
</style>