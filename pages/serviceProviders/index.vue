<template>
  <view class="template-order tn-safe-area-inset-bottom">
    <view class="z-1">
		<view class="z-2">
			<text style="flex-shrink: 0;font-size: 30rpx;" class="tn-icon-search"></text>
			<tn-input class="z-3" v-model="name" type="text" @input="nameInput" placeholder="请输入服务商名称"/>
		</view>
	</view>
    <view style="padding-top: 100rpx;">

			<view>
				<view v-for="(item,index) in list" :key="index" class="order__item"  @click="tn('/discoveryPages/form')" style="display: flex;justify-content: space-between;align-items: center;">
				  <view>
					  <view class="order__item__head tn-flex tn-flex-direction-row tn-flex-col-center tn-flex-row-between">
						<view class="order__item__head__title">
						  <text class="tn-text-bold" style="font-size: 30rpx;">{{item.name}}</text>
						 <!-- <text class="tn-color-blue--disabled tn-padding-left-xs tn-text-df tn-icon-copy"></text> -->
						</view>
					  </view>
					  
					  <view class="order__item__content tn-flex-col-center tn-flex-row-center">
					   <!-- <view class="order__item__content__image">
						  <image :src="item.securityImages" mode="aspectFill"></image>
						</view> -->
						<view class="order__item__content__title">
						  授权日期：{{timestampToTime(item.authorizeTime)}}
						</view>
					   <!-- <view class="order__item__content__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
						  <view class="order__item__content__info__price">
							<text class="order__item__content__info__price--unit">￥</text>
							<text class="order__item__content__info__price__value--integer">1000</text>
							<text class="order__item__content__info__price__value--decimal">.00</text>
						  </view>
						</view> -->
					  </view>
				  </view>
				  
				  <view class="order__item__operation tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-between">
				    <view class="order__item__operaation__left">
				     <!-- <text class="order__item__operaation__left--text tn-color-gray">2023-12-12 16:12:28</text> -->
				    </view>
				    <view class="order__item__operation__right tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-right">
				      <view class="order__item__operation__right__button">
				        <tn-button shadow shape="round" fontColor="tn-color-white" backgroundColor="#0059FF" :fontSize="24" height="auto" padding="10rpx 18rpx" @click="warrantyShow(item.id)">查看凭证</tn-button>
				      </view>
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
    
    
    <!-- 边距间隔 -->
   <!-- <view class="tn-strip-bottom"></view> -->
    
    
    <tn-popup v-model="showPopup" mode="center" :closeBtn="true" closeIconColor="white" closeBtnIcon="close-circle" :closeIconSize="40">
     <view class="model-box ss-flex-col" style="720rpx; height: 1200rpx;margin: 0 auto;">
     		  <image :src="pzImg" style="width: 720rpx; height: 1200rpx;"></image>
       <canvas canvas-id="afterSaleCanvas" id="afterSaleCanvas" style="width: 360px; height: 600px;margin: 0 auto;position: fixed;left:-1000px"></canvas>  
     </view>
    </tn-popup>
    
    <view class='tn-tabbar-height'></view>
    <tn-tips ref="tips" position="center"></tn-tips>
  </view>
</template>

<script>
  import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
  import { timestampToTime } from '@/util/util.js'
  export default {
    name: 'TemplateNews',
    mixins: [template_page_mixin],
    data(){
      return {
		phone:'',
		no:'',
		list:[],
		showPopup:false,
		pzImg:'',
		
		timestampToTime,
		pageNo: 1,
		name:'',
		loadText: {
			loadmore: '上拉加载更多',
			loading: '快速加载中...',
			nomore: '已经没有了啊'
		  },
		loadStatus:'loadmore',
		list:[],
      }
    },
	onLoad() {
		this.getlist()
	},
    methods: {
      // 跳转
      tn(e) {
        uni.navigateTo({
          url: e,
        });
      },
	  getlist(){
	  	this.loadStatus = 'loading'
	  	console.log(this.loadStatus)
	  	let data = {
	  		pageNo: this.pageNo,
	  		pageSize: 20,
	  		name:this.name
	  	}
	  	let than = this;
	  	than.$http.getRequest('app-api/member/agent/agentPage', data)
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
	  warrantyShow(id){
		  uni.showLoading({
		    title: '授权书生成中...',
		  });
		  let that = this
		  that.$http.getRequest('app-api/member/agent/getAgent',{
		  	id
		  }).then(res => {
		  		if(res.code == 0){
		  			that.showPopup = true
					let data = res.data
					setTimeout(function() {
							const ctx = uni.createCanvasContext('afterSaleCanvas');
							 const ctxValue = ctx;  
							 // ctxValue.drawImage('../../static/bac.png', 0, 0, 300, 510);
							 let canvasWidth = 0
							 uni
							   .createSelectorQuery()
							   .select("#afterSaleCanvas")
							   .boundingClientRect((res) => {
							     console.log('res',res)
							  		  canvasWidth = 360
									  // 清除之前的绘制内容（可选）
									  ctxValue.clearRect(0, 0, res.width, 600);  
							  		  ctxValue.drawImage('../../static/bac.png', 0, 0, canvasWidth,600);
							  		  ctxValue.drawImage('../../static/logo1.png', 190, 10, 111, 36);
							  		  // 设置文字样式
									  ctxValue.font  = 'normal 8px Arial'; 
									  ctxValue.setFillStyle('#666666');  
									   // const textWidth1 = ctxValue.measureText('授权编号:'+data.no).width;
									   // const x1 = (canvasWidth - textWidth1) / 2; // Canvas宽度为300px  
									  ctxValue.fillText('授权编号:'+data.no, 20, 50);
									  ctxValue.font  = 'normal bold 40px Arial';
									  ctxValue.setFillStyle('#0059FF');  
							  		   // 假设文本和样式  
							  		    const text = '授 权 书'; 
							  		    const textWidth2 = ctxValue.measureText(text).width; // 这是一个非常粗略的估算！
							  		   // 计算文本的起始x坐标以使其居中  
							  		    const x2 = (canvasWidth - textWidth2) / 2; // Canvas宽度为300px  
							  		// 绘制文本  
							  		    ctxValue.fillText(text, x2, 130); 
							  			 ctxValue.font  = 'normal 8px Arial'; 
									// 假设文本和样式
									 const text1 = 'CERTIFICATE OF AUTHORIZATION'; 
									 const textWidth3 = ctxValue.measureText(text1).width; // 这是一个非常粗略的估算！
									// 计算文本的起始x坐标以使其居中  
									 const x3 = (canvasWidth - textWidth3) / 2; // Canvas宽度为300px 
									  ctxValue.font  = 'normal 8px Arial'; 
									  ctxValue.setFillStyle('#0059FF');  
									 // 绘制文本
									ctxValue.fillText(text1, x3, 150); 
									 ctxValue.font  = 'normal 12px Arial'; 
									  ctxValue.setFillStyle('black'); 
							  		  // 绘制售后信息
									  let text2 = ''
									  let text3 = ''
							  		  that.drawWrappedText(ctxValue,'        武汉简一科技有限公司授权 '+data.name+' 法定代表人 '+data.legalPerson+' ，在中华人民共和国 '+data.provinceName+' 为我司的品牌代理商', 20, 200, 310, 30);
									  
									  that.drawWrappedText(ctxValue,'        委托其代理为简一(商标注册号32397131):品牌销售代理商，负责我司在授权区域的产品推广、销售以及上门施工等事', 20, 310, 310, 30);
									  ctxValue.fillText('授权单位：武汉简一科技有限公司', 150, 420);
									  ctxValue.fillText('授权日期：'+that.timestampToTime(data.authorizeTime), 150, 440);
									  if(data.endTime){
										ctxValue.fillText('截止日期：'+that.timestampToTime(data.endTime), 150, 460);
									  }
							  		  ctxValue.drawImage('../../static/gz_img1.png', 190, 385, 80, 80);
									  ctxValue.font  = 'normal 8px Arial';
									   ctxValue.setFillStyle('#666666'); 
									  that.drawWrappedText(ctxValue,'本授权书以正本为有效文版，不得影印、涂改、转让武汉简一科技有限公司拥有此授权书的最终解释权', 150, 500, 185, 15);
							  		  // 绘制其他图形或二维码（如果需要）  
							  		  // ... 
							  		  // 绘制完成后导出图片  
							  		  ctxValue.draw(true, () => {  
							  		    uni.canvasToTempFilePath({  
							  		      canvasId: 'afterSaleCanvas',  
							  		      success: (res) => {  
							  		        console.log('图片路径:', res.tempFilePath);
											uni.hideLoading();
							  		        // 可以在这里使用图片路径，如预览、上传等  
							  				that.pzImg = res.tempFilePath
							  		      },  
							  		      fail: (err) => {  
							  		        console.error('导出图片失败:', err)
											 uni.hideLoading();
											 showModel.value = false
											 uni.showToast({
											 	title: '生成失败',
												icon:'error'
											 });
							  		      }  
							  		    });  
							  		  });  
							  		  
							   })
							   .exec();
					}, 500);
					
					
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
	  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight){
	  		let lines = text.split('-');
	  		let line = '';
	  	 
	  		for(let n = 0; n < lines.length; n++) {
	  			let words = lines[n].split('');
	  			for (let i = 0; i < words.length; i++) {
	  				line += words[i];
	  				if (ctx.measureText(line).width > maxWidth && i > 0) {
	  					ctx.fillText(line, x, y);
	  					line = words[i];
	  					y += lineHeight;
	  				}
	  				if (i === words.length-1) {
	  					ctx.fillText(line, x, y);
	  					line = '';
	  					y += lineHeight;
	  				}
	  			}
	  		}
	  	},
	  nameInput(e){
		  // console.log(this.name)
		  this.pageNo = 1
		  this.list = []
		  this.getlist()
	  }
    }
  }
</script>

<style lang="scss" scoped>
  .wu{
  	margin-top: 25vh;
  }
  .template-order {
    background-color: $tn-bg1-color;
	min-height: 100vh;
  }
  
  /* 胶囊*/
  .tn-custom-nav-bar__back {
    width: 100%;
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
    
    &:before {
      content: " ";
      width: 1rpx;
      height: 110%;
      position: absolute;
      top: 22.5%;
      left: 0;
      right: 0;
      margin: auto;
      transform: scale(0.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      opacity: 0.7;
      background-color: #FFFFFF;
    }
  }
  /* 顶部渐变*/
  .tn-navbg {
      background: linear-gradient(-120deg, #F15BB5, #9A5CE5, #01BEFF, #00F5D4);
      /* background: linear-gradient(-120deg,  #9A5CE5, #01BEFF, #00F5D4, #43e97b); */
      /* background: linear-gradient(-120deg,#c471f5, #ec008c, #ff4e50,#f9d423); */
      /* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
      background-size: 500% 500%; 
      animation: gradientBG 15s ease infinite; 
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;
  } 
  
  @keyframes gradientBG {
      0% { 
          background-position: 0% 50%; 
      } 
      50% { 
          background-position: 100% 50%; 
      } 
      100% { 
          background-position: 0% 50%; 
      } 
  }
  .order {
    &--wrap {
      position: fixed;
      left: 0;
      right: 0;
      width: 100%;
      background-color: inherit;
    }
    
    /* 导航栏 start */
    &__tabs {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: inherit;
    }
    /* 导航栏 end */
    
    /* swiper start */
    &__swiper {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      background-color: inherit;
      // padding: 0 16rpx;
    }
    /* swiper end */
    
    /* 订单内容 start */
    &__item {
      margin: 30rpx;
      padding: 36rpx 26rpx;
      background-color: #FFFFFF;
      border-radius: 15rpx;
      box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
      
      &:first-child {
        margin-top: 40rpx;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
      
      /* 头部 start */
      &__head {
        
        &__title {
          padding-bottom: 10rpx;
          line-height: normal;
          
          &--right-icon {
            font-size: 24rpx;
            margin-left: 8rpx;
          }
        }
        
        &__status {
          font-size: 22rpx;
          color: #AAAAAA;
        }
      }
      /* 头部 end */
      
      /* 内容 start */
      &__content {
        
        margin-top: 10rpx;
        
        &__image {
          margin-right: 20rpx;
          
          image {
            width: 140rpx;
            height: 140rpx;
            border-radius: 10rpx;
          }
        }
        
        &__title {
          // padding-right: 40rpx;
          display: -webkit-box;
          overflow: hidden;
          white-space: normal !important;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
		  font-size: 24rpx;
        }
        
        &__info {
          
          &__price {
            &--unit {
              font-size: 20rpx;
            }
            &__value--integer, &__value--decimal {
              font-weight: bold;
            }
            &__value--decimal {
              font-size: 20rpx;
            }
          }
          
          &__count {
            color: #AAAAAA;
            font-size: 24rpx;
          }
        }
      }
      /* 内容 end */
      
      /* 操作按钮 start */
      &__operation {
        // margin-top: 30rpx;
        
        &__right {
          &__button {
            margin-left: 10rpx;
          }
        }
      }
      /* 操作按钮 end */
    }
    /* 订单内容 end */
  }
  .z-1{
	  background-color: white;
	  padding: 20rpx;
	  top: 0;
	  left: 0;
	  width: 100%;
	  position: fixed;
  }
  .z-2{
	  display: flex;
	  align-items: center;
	  background-color: $tn-bg1-color;
	  border-radius: 100rpx;
	  padding: 0 20rpx;
  }
  .z-3{
	  width: 100%;
	  margin-left: 20rpx;
  }
</style>