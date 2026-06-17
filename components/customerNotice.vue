<template>
	<tn-popup class="customer-notice-popup" v-model="localVisible" width="90%" mode="center" borderRadius="16" closeBtn="true" closeBtnIcon="close-fill" @close="colse">
	  <view class="popup-content">
		  <view class="popup-title">
			  联系客户须知
		  </view>
		  <view class="popup-list">
			  <view class="popup-list-item" v-for="(item,index) in list" :key="inde">
				  <view class="number">{{index+1}}</view>
				  <view class="text">{{item}}</view>
			  </view>
		  </view>
		  <view class="popup-button-box">
		  	<tn-button class="popup-button" padding="40rpx 0" width="100%" backgroundColor="#0059FF" fontColor="#ffffff" @click="contactCustomers">了解</tn-button>
		  </view>
	  </view>
	</tn-popup>
</template>

<script>
// import tnPopup from '@/tuniao-ui/components/tn-popup/tn-popup.vue';
export default {
	// components: {
	//   tnPopup
	// },
  props: {
    getCustomerNoticeVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list:[
		  '是否高空作业(超3米为高空作业)，如果高空作业，需要确认高空服务费:标准为增加20元/平米;需要确认是否有登高设备如无，租赁设备则按实报实销;',
		  '施工卫生环境如何?如较差，需要收取清洁费100元/次',
		  '是否需要除原有膜和胶?如需要，需要增收清胶费50元/次',
		  '进行告知义务:实际尺寸，需要他实际测量后为准，我可以现场核实；',
		  '如仅需施工的订单，需要询问用户膜材是否已到货;'
	  ],
	  localVisible: false
    };
  },
  computed: {},
  watch: {
	  // 如果需要响应prop的变化，可以使用watch  
	      getCustomerNoticeVisible(newVal) {  
	        this.localVisible = newVal;  
	      }  
  },
  created() {
   
  },
  methods: {
	  colse(){
		  this.$emit('customerNoticeClose')
	  },
	  contactCustomers(){
		  this.$emit('contactCustomers')
	  }
  }
};
</script>
<style lang="scss" scoped>
.customer-notice-popup{
  .popup-content {
	  padding: 0 30rpx;
	  padding-bottom: 30rpx;
	.popup-title{
		font-size: 32rpx;
		color: $tn-font-title-color;
		text-align: center;
		font-weight: bold;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1rpx solid #D9D9D9;;
	}
	.popup-list{
		padding: 30rpx 0;
		.popup-list-item{
			display: flex;
			align-items: flex-start;
			margin-bottom: 30rpx;
			.number{
				width: 36rpx;
				height: 36rpx;
				border-radius: 100%;
				background: #00091A;
				color: white;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-shrink: 0;
			}
			.text{
				margin-left: 15rpx;
			}
		}
	}
	.popup-button-box{
		margin-top: 20rpx;
	}
  }
}
  ::v-deep  .tn-icon-close-fill{
  	font-size: 36rpx !important;
  	color: $tn-font-title-color !important;
  }
</style>