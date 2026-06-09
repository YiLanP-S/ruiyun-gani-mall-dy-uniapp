<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 120rpx)':'120rpx'}">
		<view class="c-2">
			<view class="c-15" v-for="item in detail.item" :key="item.id">
				<image class="c-16" :src="item.picUrl"></image>
				<view class="c-17">
					<view class="c-18">{{item.spuName}}</view>
					<view class="c-19-box">
						<view class="c-19" v-for="(item1,index1) in item.properties" :key="index1">{{item1.propertyName+':'+item1.valueName}}<text>/</text></view>
					</view>
					<view class="c-20">
						<view class="c-21"><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item.price / 100).toFixed(2)) }}</text></view>
						<!-- <view class="c-22">x{{item.count / 10000}}m²</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="e-1">
			<view class="e-4">相关描述</view>
			<view class="e-2">
				<tn-input v-model="content" placeholder="客官~请描述您遇到的问题，建议上传照片" type="textarea" :height="200" :clearable="false"/>
				<view class="e-3">
					<tn-image-upload :action="action" :fileList="fileList" @onSuccess="uploadSuccess" @onRemove="uploadRemove" @on-choose-complete="chooseComplete"  @on-error="uploadError"></tn-image-upload>
				</view>
			</view>
		</view> -->
		<view class="c-40" @click="showModal = true">
		   <text class="c-41">申请原因</text>
		   <view class="c-42">
		     <text class="c-43" v-if="applyReason">{{ applyReason }}</text>
		     <text class="c-44" v-else>请选择申请原因~</text>
		     <text class="tn-icon-righty"></text>
		   </view>
		 </view>
		 <view class="c-70" v-if="secondCurrentValue=='其他'||thirdCurrentValue=='其他'">
			 <text class="c-41">其它描述</text>
			 <view class="c-71">
				<tn-input height="200" placeholder="客官~请描述您遇到的问题" type="textarea" v-model="applyDescription" :clearable="false" />
			 </view>
		 </view>
		<tn-tips ref="tips" position="center"></tn-tips>
		<!-- 悬浮按钮-->
		<view class="tn-flex tn-footerfixed tn-padding" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 20rpx)':''}">
			
			<view class="tn-flex-1 justify-content-item tn-text-center c-38">
				<tn-button class="tn-button c-39 c1-39" shape="round" :plain="true" backgroundColor="#7A8499" fontColor="#7A8499" padding="40rpx 0" width="100%" :fontSize="28">
					<button open-type="lifeIm" style="width: 100%;padding: 0;margin: 0;font-size: 28rpx;border-radius: 50rpx;">联系客服</button>
				</tn-button>
				<tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28"
					fontColor="#FFFFFF" @click="submit">
					<text class="">提交申请</text>
				</tn-button>
				<!-- <pay-button-sdk  
				  :mode="1"
				  :order-status="1"
				  :order-id="detail.id"
				  :refund-total-amount="orderIdForRefundAmount" 
				  :apply-refund-params="applyRefundParams"
				> -->
				<!-- <pay-button-sdk
				  :id="3"
				  :mode="1"
				  :order-status="1"
				  :order-id="orderIdStr"
				  :refund-total-amount="orderIdForRefundAmount"
				  :apply-refund-params="applyRefundParams"
				  @applyrefund="applyRefund"
				>
				</pay-button-sdk> -->
			</view>
		
		</view>
		<tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
		<!-- 申请原因弹窗 -->
		<tn-popup v-model="showModal"  mode="bottom" closeBtn="true" borderRadius="16" height="70%" closeBtnIcon="close-fill">
		   <view class="c-56">
		   		<view class="c-57">申请原因</view>
				<scroll-view :scroll-y="true" class="content_auto" :style="{height:vuex_is_black_stripe?'calc(100% - 20px - 101rpx - 120rpx)':'calc(100% - 101rpx - 120rpx)'}">
					<view style="padding-bottom:30rpx">
						<view class="modal-content content_box" v-for="item1 in refundDetails">
						  <view style="font-size:35rpx;font-weight:bold;padding:10rpx 0;">{{item1.reasonCategory}}</view>
						 <radio-group @change="onChange">
							<label
							  v-for="item in item1.details"
							  :key="item"
							>
							  <view class="c-45">
								  <view class="ss-flex-1 ss-p-20" style="font-size:30rpx;">{{ item.detail }}</view>
								  <radio
									:value="item.detail"
									color="#0059FF"
									:checked="item.detail === secondCurrentValue"
								  />
							  </view>
							  <radio-group @change="onChange1" v-if="item.detail === secondCurrentValue">
								  <label
									v-for="item2 in item.details"
									:key="item2"
								  >
									  <view class="c-45" style="padding: 0 20rpx">
											<view class="ss-flex-1 ss-p-20" style="font-size:26rpx;">{{ item2.detail }}</view>
											<radio color="#0059FF" :value="item2.detail" :key="item2"/>
									  </view>
								  </label>
							  </radio-group>
							</label>
						  </radio-group>
						</view>
					</view>
				</scroll-view>
		     <!-- <view class="modal-foot foot_box ss-flex ss-row-center ss-col-center">
		       <button class="ss-reset-button close-btn ui-BG-Main-Gradient" @tap="onReason">
		         确定
		       </button>
		     </view> -->
			 <view class="c-65">
			 	<view class="c-69" style="width: 100%;">
			 		<tn-button class="tn-button" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28"
			 			fontColor="#FFFFFF" @click="onReason">
			 			<text class="">确定</text>
			 		</tn-button>
			 	</view>
			 </view>
		   </view>
		 </tn-popup>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import customerNotice from "@/components/customerNotice";
	import {timestampToTime} from '@/util/util.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		components: {
		  customerNotice
		},
		data() {
			return {
				content:'',
				 // 演示地址，请勿直接使用
				action: '',
				fileList: [],
				
				orderId:'',
				itemId:'',
				detail:'',
				images:[],
				showModal:false,
				refundDetails:[{
					"reasonCategory": "个人原因",
					"details": [{
							"detail": "买多了/买错了/不需要了"
						},
						{
							"detail": "没看清楚使用规则，要用时才发现有限制"
						}
					]
				},
				{
					"reasonCategory": "商家原因",
					"details": [{
							"detail": "商家营业但不接待",
							"details": [{
								"detail": "额外增加使用条件"
							}, {
								"detail": "商家不承认团购"
							}, {
								"detail": "商品下架/活动结束"
							}, {
								"detail": "核销机器坏了/核销异常"
							}, {
								"detail": "团购券过期"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "商家停业/装修/转让"
						},
						{
							"detail": "需要加价/购买其他产品才能用"
						},
						{
							"detail": "电话/发消息联系不上商家",
							"details": [{
								"detail": "找不到门店"
							}, {
								"detail": "电话号码为空/错误/停机"
							}, {
								"detail": "商家不接电话"
							}, {
								"detail": "商家在线客服不回复"
							}, {
								"detail": "没有商家联系入口"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "商品缺货/无货",
							"details": [{
								"detail": "商品已下架"
							}, {
								"detail": "商品已售罄/无现货"
							}, {
								"detail": "套餐部分商品售馨"
							}, {
								"detail": "商家在线客服不回复"
							}, {
								"detail": "套餐内赠品售罄"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "商家引导改用其他方式付款",
							"details": [{
								"detail": "使用其他团购APP交易"
							}, {
								"detail": "使用微信、支付宝、现金交易"
							}, {
								"detail": "抖音重新下单交易"
							}, {
								"detail": "其他支付方式"
							}]
						},
						{
							"detail": "实际与宣传/描述不一样",
							"details": [{
								"detail": "服务内容与购买时不一致"
							}, {
								"detail": "实际店铺地址与平台展示不一致"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "商家服务态度差"
						},
						{
							"detail": "团购体验/效果不满意"
						}
					]
				},
				{
					"reasonCategory": "其他原因",
					"details": [{
							"detail": "排队太久/预约不上位置、服务人员等",
							"details": [{
								"detail": "排队时间太久"
							}, {
								"detail": "预约不上位置或服务"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "商品买贵了或降价",
							"details": [{
								"detail": "店里更优惠"
							}, {
								"detail": "其他平台更优惠"
							}, {
								"detail": "抖音降价了"
							}, {
								"detail": "商品折扣力度小"
							}, {
								"detail": "其他"
							}]
						},
						{
							"detail": "朋友/网上评价不好"
						},
						{
							"detail": "距离过远商家无法服务"
						},
						{
							"detail": "担心安全/天气等问题"
						},
						{
							"detail": "其他"
						}
					]
				}],
				reasonList: [], // 可选的申请原因数组
				secondCurrentValue: '', // 当前选择的二级售后原因
				thirdCurrentValue: '', // 当前选择的三级售后原因
				applyReason: '',
				applyDescription: '',
				ttId:'',
				itemOrdeId:'',
				orderIdForRefundAmount:0,
				applyRefundParams:'',
				orderIdStr:''
			}
		},
		onLoad(options){
			if(options.orderId){
				this.orderId = options.orderId
				this.getDetail()
			}
			if(options.itemId){
				this.itemId = options.itemId
			}
		},
		onShow() {
			// setTimeout(()=>{
			// 	this.showCountDown = true
			// })
			// console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)
			this.action=this.$http.commoneUrl+'app-api/infra/file/upload';
		},
		methods: {
			getDetail(){
				this.$http.getRequest('app-api/trade/order/get-detail',{
					id:this.orderId
				})
					.then(res => {
						if(res.code == 0){
								this.detail = res.data
								this.orderIdStr = res.data.id + ''
								this.detail.item = this.detail.items.filter(item => item.id == this.itemId )
								
								this.getSpuDetail(res.data.items[0].spuId)
								this.getSpuRefundItemId()
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
			getSpuDetail(id){
				this.$http.getRequest('app-api/product/spu/get-detail',{
					id:id
				})
					.then(res => {
						if(res.code == 0){
								this.ttId = res.data.ttId
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
			getSpuRefundItemId(){
				this.$http.getRequest('app-api/trade/order/getTTOrderItemId',{
					id:this.orderId
				})
					.then(res => {
						if(res.code == 0){
								this.itemOrdeId = res.data
								
								this.orderIdForRefundAmount = this.detail.items[0].price
								this.applyRefundParams = {
								            orderId: this.orderIdStr,
								            itemOrderList: [
								                {itemOrderId:this.itemOrdeId,refundAmount:this.detail.items[0].price}
								            ] 
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
			//融合预约订单未预约单独退
			applyRefund(event) { 
			    const { orderId } = event.detail; 
			    const itemOrderList = [ 
			      {
			        itemOrderId:this.itemOrdeId,//商品单，可在预下单回调itemOrderlist里获取，或通过查询券状态接口获取
			        refundAmount:this.detail.items[0].price / 100,//退款金额必传，如果使用营销，需传原价
			      }
			    ];
			  const extra = { orderId , itemOrderList }; 
			    console.log(extra);
			    return new Promise(resolve => { 
			      resolve(extra); 
			    }); 
			  },
			onSubmit(){
				if(this.content==''){
					this.$refs.tips.show({
						  msg: '描述不能为空',
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
						return
				}
				this.$http.postRequest('app-api/trade/after-sale/create',{
					orderItemId: this.itemId,
					refundPrice: this.detail.item[0].payPrice,
					way: 30,
					applyReason: '',
					applyDescription: this.content,
					applyPicUrls: this.images,
				})
					.then(res => {
						if(res.code == 0){
							this.$refs.toast.show({
							  title: '申请成功',
							  icon: 'success',
							  image: '',
							  duration: 1000
							})
							setTimeout(()=>{
								this.tn('./list')
							},1000)
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
			
			// 提交表单
			submit() {
				  // formData.way = 30
			 //  // #ifdef MP
			 //  sheep.$platform.useProvider('wechat').subscribeMessage('order_aftersale_change');
			 //  // #endif
			 //  let data = {
			 //    orderItemId: state.itemId,
			 //    refundPrice: state.item.payPrice,
			 //    ...formData,
			 //  };
			 if (this.applyReason=='') {
			   this.$refs.tips.show({
			   	  msg: `请选择退款理由`,
			   	  backgroundColor: '#E83A30',
			   	  fontColor: '#FFFFFF',
			   	  duration: 1500
			   	})
			   return;
			 }
			 if ((this.secondCurrentValue=='其他'||this.thirdCurrentValue=='其他')&&this.applyDescription=='') {
			   this.$refs.tips.show({
			   	  msg: `请输入其他描述`,
			   	  backgroundColor: '#E83A30',
			   	  fontColor: '#FFFFFF',
			   	  duration: 1500
			   	})
			   return;
			 }
			 console.log('requestobj',{
				 refundInfo:{
				      reason: [this.applyReason], // 退款理由 必填
				      note:this.applyDescription, // 备注 非必填
				  },
				  outOrderNo: this.detail.id+'', // 外部订单号 必填
				 refundTotalAmount:this.detail.totalPrice,
				 isRefundRelatedOrderOnly:false,
				 refundRelatedOrderDetail:[{
				 			 orderId: this.detail.ttBookId, 
				 			  orderType:2,
				 			  refundAmount: 0,
				 			 deductFeeAmount: 0
				 }],
				 itemOrderList:[
				 	{
				 		itemOrderId: this.itemOrdeId,
				 		refundAmount:this.detail.totalPrice,
				 		refundRelatedItemType:2,
				 		deductFeeAmount:0
				 	},
				 ]
			 })
			 let requestObj = {}
			 if(this.detail.ttBookId){
				  tt.applyRefund({
				        refundInfo:{
				            reason: [this.applyReason], // 退款理由 必填
				            note:this.applyDescription, // 备注 非必填
				        },
				        outOrderNo: this.detail.id+'', // 外部订单号 必填
				  		refundTotalAmount:this.detail.totalPrice,
				  		isRefundRelatedOrderOnly:false,
				  		refundRelatedOrderDetail:[{
				  					 orderId: this.detail.ttBookId, 
				  					  orderType:2,
				  					  refundAmount: 0,
				  					 deductFeeAmount: 0
				  		}],
				  		itemOrderList:[
				  			{
				  				itemOrderId: this.itemOrdeId,
				  				refundAmount:this.detail.totalPrice,
				  				refundRelatedItemType:2,
				  				deductFeeAmount:0
				  			},
				  		],
				        success: res => {
				          const { orderId, outRefundNo, refundId } = res;
				          console.log('申请退款成功');
						   this.$refs.toast.show({
						     title: '申请成功',
						     icon: 'success',
						     image: '',
						     duration: 1000
						   })
				  		   // sheep.$router.go('/pages/order/aftersale/list');
				  		   setTimeout(()=>{
				  			  uni.redirectTo({
				  			    url: '/pages/order/afterSales/list',
				  			  }); 
				  		   },1000)
				          console.log('orderId', orderId, 'outRefundNo', outRefundNo, 'refundId', refundId);
				        },
				        fail: res => {
				          const { errNo, errMsg, errLogId } = res;
				          console.log('申请失败', errNo, errMsg, errLogId);
				  		   // uni.showToast({
				  		   //   title: errMsg,
				  		   // });
						   this.$refs.tips.show({
						   	  msg: errMsg,
						   	  backgroundColor: '#E83A30',
						   	  fontColor: '#FFFFFF',
						   	  duration: 1500
						   	})
				        },
				      });
			 }else{
				tt.applyRefund({
					   		 outOrderNo: this.detail.id+'',
					   		refundInfo:{
					   		    reason: [this.applyReason], // 退款理由 必填
					   		    note:this.applyDescription, // 备注 非必填
					   		},
					   		 itemOrderList:[{itemOrderId: this.itemOrdeId,refundAmount:this.detail.totalPrice}],
					   		 refundType:1,
					   		 refundReasons:[
					   		         {
					   		             text:this.applyReason
					   		         }
					   		 ],
					   		 refundDescription:this.applyDescription,
					   		 itemOrderDetail:[{
					   		 		 itemOrderId: this.itemOrdeId, 
					   		 		 refundAmount:this.detail.totalPrice,
					   		 		 refundRelatedItemType:2,
					   		 		 deductFeeAmount:0
					   		 }],
				      success: res => {
				        const { orderId, outRefundNo, refundId } = res;
				        console.log('申请退款成功');
						  this.$refs.toast.show({
						    title: '申请成功',
						    icon: 'success',
						    image: '',
						    duration: 1000
						  })
						   // sheep.$router.go('/pages/order/aftersale/list');
						   setTimeout(()=>{
							  uni.redirectTo({
							    url: '/pages/order/afterSales/list',
							  }); 
						   },1000)
				        console.log('orderId', orderId, 'outRefundNo', outRefundNo, 'refundId', refundId);
				      },
				      fail: res => {
				        const { errNo, errMsg, errLogId } = res;
				        console.log('申请失败', errNo, errMsg, errLogId);
						   // uni.showToast({
						   //   title: errMsg,
						   // });
						  this.$refs.tips.show({
						  	  msg: errMsg,
						  	  backgroundColor: '#E83A30',
						  	  fontColor: '#FFFFFF',
						  	  duration: 1500
						  	})
				      },
				    });
			 }
			  // const { code } = await AfterSaleApi.createAfterSale(data);
			 
			},
			chooseComplete(){
				uni.showLoading({
					title: '上传中...'
				})
			},
			uploadSuccess(data, index, lists){
				console.log()
				uni.hideLoading()
				if(data.code == 0 ){
					this.images[index]=data.data
				}
				// console.log(this.images)
			},
			uploadError(){
				uni.hideLoading()
				this.$refs.tips.show({
				  msg: '上传失败',
				  backgroundColor: '#E83A30',
				  fontColor: '#FFFFFF',
				  duration: 1500
				})
			},
			uploadRemove(index, lists, name){
				this.images.splice(index,1)
				// console.log(this.images)
			},
			// 跳转
			tn(e) {
				uni.navigateTo({
					url: e,
				});
			},
			
			// 选择申请原因
			onChange(e) {
			  this.secondCurrentValue = e.detail.value;
				this.thirdCurrentValue = ''
				this.applyDescription = ''
			},
			onChange1(e) {
				this.thirdCurrentValue = e.detail.value;
				this.applyDescription = ''
			},
			// 确定
			onReason() {
			  this.applyReason = this.thirdCurrentValue?this.thirdCurrentValue:this.secondCurrentValue;
			  this.showModal = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.oa-content{
		min-height: 100vh;
		background-color: $tn-bg1-color;
		box-sizing: border-box;
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
	
	/deep/ .tn-button button{
		background: linear-gradient(130.69deg, #0059FF 0%, #004AD4 100%);
		// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
	}
	/deep/ .c1-39.tn-button button{
		background: white;
		// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
	}
	/deep/ .tn-icon-close-fill{
		font-size: 40rpx !important;
		color: $tn-font-title-color !important;
	}
	/* 底部悬浮按钮 end*/
	/deep/ .time-line-item__content__time{
		color: #a29e9e;
		font-size: 24rpx;
		margin-top: 10rpx;
	}
	.e-1{
		padding: 20rpx 30rpx;
	}
	.e-2{
		padding: 20rpx;
		border-radius: 16rpx;
		background-color: $tn-bg1-color;
	}
	.e-3 /deep/ .tn-image-upload__item{
		background-color: transparent !important;
		border-radius: 16rpx;
		border: 1rpx dashed #7A8499;
	}
	.e-4{
		margin-top: 10rpx;
		font-weight: bold;
		color: $tn-font-title-color;
		margin-bottom: 20rpx;
		font-size: 30rpx;
	}
	.e-5{
		display: flex;
		align-items: center;
		margin-top: 30rpx;
	}
	.e-6{
		margin-right: 30rpx;
	}
	.c-2{
		padding:30rpx 30rpx;
		background-color: white;
		border-radius: 8rpx;
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
		width: 490rpx;
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
	.c-38{
		width: 100%;
		gap: 20rpx; 
		display: flex;
	}
	.c-39{
		flex: 1;
	}
	.c-40{
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin-top: 30rpx;
		height: 80rpx;
	}
	.c-41{
		font-size: 30rpx;
		color: $tn-font-title-color;
	}
	.c-45{
		display: flex;
		justify-content: space-between;
		margin-bottom:20rpx;
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
	.c-61 .tn-radio-group-class tn-radio:last-child /deep/ .tn-radio__label{
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
		background-color: white;
		padding:20rpx 30rpx;
		border-top: 1px solid  $tn-border-solids-color;
	}
	.c-71{
		margin-top: 10rpx;
	}
</style>