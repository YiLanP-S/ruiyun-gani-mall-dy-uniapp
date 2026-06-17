<template>
  <view class="template-news tn-safe-area-inset-bottom">
    
    <view class="tn-margin-top-xs">
    <!-- <view class="nav_title--wrap">
        <view class="nav_title tn-main-gradient-blue">
            图鸟模板上线啦
        </view>
      </view> -->
      <view class="news-img tn-padding">
		  <view class="b-1" v-if="name"><text>[施工项目]</text>{{name}}</view>
		  <view class="b-1" v-if="address"><text>[施工场地]</text>{{address}}</view>
		  <view class="b-1" v-if="typeName"><text>[产品系列]</text>{{typeName}}</view>
		  <view class="b-1" v-if="color"><text>[贴膜颜色]</text>{{color}}</view>
		  <mp-html style="margin-top:30rpx" :content="htmlContent"/>
      </view>
      
    </view>
    
<!--   <view class="tn-margin-top tn-padding-top-sm tn-margin-bottom">
      <view class="see">
        <view class="justify-content-item tn-flex tn-flex-col-center">
          <view style="margin-left: 15rpx;margin-right: 6rpx;transform: scale(0.85);">
            <tn-avatar-group :lists="groupList" size="sm"></tn-avatar-group>
          </view>
          <text class="tn-color-gray">86人</text>
        </view>
        <view class="justify-content-item tn-color-gray tn-text-center tn-margin-right" style="padding-top: 5rpx;">
          <text class="tn-icon-rocket tn-text-lg" style="padding-right: 5rpx;"></text>
          <text class="tn-padding-right tn-text-df">263</text>
          <text class="tn-icon-like-lack tn-text-lg" style="padding-right: 5rpx;"></text>
          <text class="tn-text-df">34</text>
        </view>
        
      </view>
    </view> -->
    
    <!-- 边距间隔 -->
   <!-- <view class="tn-strip-bottom"></view> -->
    
    
    
    <!-- 悬浮按钮-->
    <!-- <view class="tn-flex tn-flex-row-between tn-footerfixed">
      <view class="tn-flex-1 justify-content-item tn-margin-xs tn-text-center">
        <tn-button backgroundColor="#FBBD12" padding="40rpx 0" width="90%" :fontSize="28">
          <text class="tn-color-white">点赞鼓励</text>
          <text class="tn-icon-like-lack tn-padding-left-xs tn-color-white"></text>
        </tn-button>
      </view>
      <view class="tn-flex-1 justify-content-item tn-margin-xs tn-text-center">
        <tn-button backgroundColor="#05C160" padding="40rpx 0" width="90%" :fontSize="28" open-type="share">
          <text class="tn-color-white">分享好友</text>
          <text class="tn-icon-wechat tn-padding-left-xs tn-color-white"></text>
        </tn-button>
      </view>
    </view> -->
    
    <view class="footerfixed tn-bg-white tn-safe-area-inset-bottom">
      <view class="tn-flex tn-flex-row-between tn-flex-col-center">
        <view class="tn-flex-1 justify-content-item tn-color-gray">
          <view class="tn-flex tn-flex-row-center tn-flex-col-center">
            <view class="tn-flex tn-padding-right tn-padding-left">
              <text class="tn-icon-comment" style="font-size: 45rpx;"></text>
            </view>
            <view class="tn-flex tn-padding-right">
              <text class="tn-text-df">{{zxNum}}人 已咨询</text>
            </view>
          </view>
        </view>
        <view class="tn-flex-1 justify-content-item tn-padding-sm tn-main-gradient-red">
          <tn-button shape="round" backgroundColor="#3668fc00" width="100%" @click="callPhone">
            <text class="tn-color-white tn-text-xl" hover-class="tn-hover" :hover-stay-time="150">
              产品咨询
            </text>
          </tn-button>
        </view>
      </view>
    </view>
    
    <view class='tn-tabbar-height'></view>
    <tn-tips ref="tips" position="center"></tn-tips>
  </view>
</template>

<script>
  import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
  import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html.vue';
  export default {
	components: { mpHtml},
    name: 'TemplateNews',
    mixins: [template_page_mixin],
    data(){
      return {
        groupList: [
          {src: 'https://resource.tuniaokj.com/images/blogger/avatar_1.jpeg'},
          {src: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg'},
          {src: 'https://resource.tuniaokj.com/images/blogger/avatar_3.jpeg'},
          {src: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg'},
          {src: 'https://resource.tuniaokj.com/images/blogger/blogger_beibei.jpg'},
        ],
        news3: [{
            userAvatar: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg',
            userName: '可我会像',
            date: '2021年12月20日',
            color: 'red',
            label: ['小程序'],
            title: '我不喜欢带伞，因为雨滴从来不滴落我手心上',
            desc: '小程序前端源码，欢迎白嫖嗷嗷，可以的话，插件市场三连支持一下aa',
            mainImage:[
              'https://resource.tuniaokj.com/images/simple/image0.jpg',
              'https://resource.tuniaokj.com/images/simple/logo-flower.jpg',
              'https://resource.tuniaokj.com/images/simple/banner0.jpg',
            ],
            viewUser: {
              latestUserAvatar: [{
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_1.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_3.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg'
                },
              ],
              viewUserCount: 567
            },
            collectionCount: 543,
            commentCount: 543,
            likeCount: 206
          }
        ],
        
        news2: [{
            userAvatar: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg',
            userName: '可我会像',
            date: '2021年12月20日',
            color: 'red',
            label: ['小程序'],
            title: '小程序官网源码，已上线',
            desc: '小程序前端源码，欢迎白嫖嗷嗷，可以的话，插件市场三连支持一下aa',
            mainImage: 'https://resource.tuniaokj.com/images/shop/prototype2.jpg',
            viewUser: {
              latestUserAvatar: [{
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_1.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_3.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg'
                },
              ],
              viewUserCount: 567
            },
            collectionCount: 543,
            commentCount: 543,
            likeCount: 206
          }
        ],
        
        news: [{
            userAvatar: 'https://resource.tuniaokj.com/images/blogger/blogger_beibei.jpg',
            userName: '可我会像',
            date: '2021年12月20日',
            color: 'cyan',
            label: ['模型'],
            title: '一个拥有大量3D模型的网站',
            desc: '3D模型了解一下？',
            mainImage: 'https://resource.tuniaokj.com/images/shop/prototype1.jpg',
            viewUser: {
              latestUserAvatar: [{
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_1.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_3.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg'
                },
              ],
              viewUserCount: 987
            },
            collectionCount: 567,
            commentCount: 69,
            likeCount: 65
          },
          {
            userAvatar: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg',
            userName: '可我会像',
            date: '2021年12月20日',
            color: 'blue',
            label: ['UI设计'],
            title: '为什么资讯不显示时间？',
            desc: '你确定你经常更新文章吗？',
            mainImage: 'https://resource.tuniaokj.com/images/shop/computer2.jpg',
            viewUser: {
              latestUserAvatar: [{
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_1.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_2.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_3.jpeg'
                },
                {
                  src: 'https://resource.tuniaokj.com/images/blogger/avatar_4.jpeg'
                },
              ],
              viewUserCount: 321
            },
            collectionCount: 654,
            commentCount: 232,
            likeCount: 543
          }
        ],
		
		htmlContent:'',
		id:'',
		zxNum:0,
		name:'',
		address:'',
		typeName:'',
		color:''
      }
    },
	onLoad(options) {
		this.id = options.id
		this.zxNum = this.getRandomInt(300,1000)
		this.getDetail()
	},
    methods: {
      // 跳转
      tn(e) {
        uni.navigateTo({
          url: e,
        });
      },
	  
	  getDetail(){
		  let that = this;
		 that.$http.getRequest('app-api/official/example-info/get',{
		 	id: that.id
		 })
		 	.then(res => {
		 		if(res.code == 0){
		 			that.htmlContent = res.data.content
					that.name = res.data.name
					that.address = res.data.address
					that.typeName = res.data.typeName
					that.color = res.data.color
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
	  
	  //拨打电话
	  callPhone(){
	    let that = this
	    uni.makePhoneCall({
	      phoneNumber: '18727309301',
	      success: () => {
	        console.log('拨打电话成功！')
	      },
	      fail: () => {
	  		that.$refs.tips.show({
	  		  msg: '拨打电话失败！',
	  		  backgroundColor: '#E83A30',
	  		  fontColor: '#FFFFFF',
	  		  duration: 1500
	  		})
	      },
	    })
	  },
	  
	  getRandomInt(min, max) {
	      // 包含 min 和 max
	      min = Math.ceil(min);  // 确保 min 是整数
	      max = Math.floor(max); // 确保 max 是整数
	      return Math.floor(Math.random() * (max - min + 1)) + min; // 含 max，含 min
	  }
    }
  }
</script>

<style lang="scss" scoped>

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
  
  /* 标题 start */
  .nav_title {
    -webkit-background-clip: text;
    color: transparent;
    
    &--wrap {
      position: relative;
      display: flex;
      height: 120rpx;
      font-size: 42rpx;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      background-image: url(https://resource.tuniaokj.com/images/title_bg/title00.png);
      background-size: cover;
    }
  }
  /* 标题 end */
  
  /* 富文本图示意 start */
  .news-img {
    z-index: -1;
    padding-bottom: 40rpx;
  
    image {
      width: 100%;
      margin: 20rpx 0;
      // height: 3373rpx;
      // z-index: -1;
    }
  }
  
  /* 资讯主图 start*/
  .image-article {
    border-radius: 8rpx;
    width: 200rpx;
    height: 200rpx;
    position: relative;
  }
  
  .image-pic{
    border: 1rpx solid #F8F7F8;
    background-size: cover;
    background-repeat:no-repeat;
    // background-attachment:fixed;
    background-position:top;
    border-radius: 10rpx;
  }
  
  .article-shadow {
    border-radius: 15rpx;
    box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
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
  
  /* 标签内容 start*/
  .tn-tag-content {
    &__item {
      display: inline-block;
      line-height: 35rpx;
      color: #1D2541;
      background-color: #F3F2F7;
      border-radius: 10rpx;
      font-size: 22rpx;
      padding: 5rpx 15rpx;
  
      &--prefix {
        padding-right: 10rpx;
      }
    }
  }
  
  
  /* 大单图 start*/
  .tn-blogger-content2 {
    &__wrap {
      padding: 30rpx;
    }
    
    &__info {
      &__btn {
        margin-right: -12rpx;
        opacity: 0.5;
      }
    }
    
    &__label {
      &__item {
        line-height: 45rpx;
        padding: 0 20rpx;
        margin: 5rpx 18rpx 0 0;
        
        &--prefix {
          color: #00FFC8;
          padding-right: 10rpx;
        }
      }
      
      &__desc {
        line-height: 55rpx;
      }
    }
    
    &__main-image {
      box-shadow: 0rpx 5rpx 40rpx 0rpx rgba(43, 158, 246, 0.2);
      border-radius: 16rpx;
      
      &--1 {
        max-width: 690rpx;
        min-width: 690rpx;
        max-height: 400rpx;
        min-height: 400rpx;
      }
      
      &--2 {
        max-width: 260rpx;
        max-height: 260rpx;
      }
      
      &--3 {
        height: 212rpx;
        width: 100%;
      }
    }
    
    &__count-icon {
      font-size: 40rpx;
      padding-right: 5rpx;
    }
  }
  
  .image-design{
    padding: 160rpx 0rpx;
    font-size: 40rpx;
    font-weight: 300;
    position: relative;
  }
  .image-pic{
    background-size: cover;
    background-repeat:no-repeat;
    // background-attachment:fixed;
    background-position:top;
    border-radius: 10rpx;
  }
  /* 文章内容 end*/
  
  /* 底部悬浮按钮 start*/
  .tn-tabbar-height {
  	min-height: 100rpx;
  	height: calc(120rpx + env(safe-area-inset-bottom) / 2);
  }
  .tn-footerfixed {
    position: fixed;
    width: 100%;
    bottom: calc(30rpx + env(safe-area-inset-bottom));
    z-index: 1024;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);
    
  }
  /* 底部 start*/
  .footerfixed{
   position: fixed;
   width: 100%;
   bottom: 0;
   z-index: 999;
   box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.07);
  }
  
  /* 底部悬浮按钮 end*/
  
  /* 查看*/
  .see {
    display: flex;
    justify-content: space-between;
    padding-top: 10rpx;
    border-radius: 6rpx;
    color: #666;
    line-height: 1.6;
  }
  /* 间隔线 start*/
  .tn-strip-bottom {
   width: 100%;
   border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
  }
   /* 间隔线 end*/
   .b-1{
	   line-height: 50rpx;
   }
   .b-1 text{
	   font-weight: bold;
	   margin-right: 10rpx;
   }
</style>
