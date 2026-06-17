<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 120rpx)':'120rpx'}">
		<view class="tn-padding-bottom-xl">
			<view class="d-2">
				<view class="d-4">邀请用户加入简一膜法</view>
				<view class="d-5">用户下单后您将获得25%的佣金</view>
				<view class="h-1">
					<!-- <view class="h-2">
						<image class="h-3" :src="userData.avatar?userData.avatar:'https://www.tmsglm.com/statics/yonghu.png'"></image>
						<view class="h-4">{{userData.nickname}}</view>
					</view>
					<image class="h-5" :src="userData.distributorCodeUrl"></image> -->
					<canvas canvas-id="shareCanvas" style="width: 300px; height: 400px;margin: 0 auto;position: fixed;left: -9999px;"></canvas>
					<image :src="pzImg" style="width: 300px; height: 400px;margin: 0 auto;"></image>
				</view>
				<view style="padding: 0 100rpx;">
					<tn-button class="tn-button" padding="40rpx 0" shape="round" width="100%" :fontSize="28"
						fontColor="#FFFFFF" @click="saveImage">
						<text class="">保存二维码至相册</text>
					</tn-button>
					<!-- <tn-button class="tn-button tn-button3" shape="round" padding="40rpx 0" width="100%" :fontSize="28"
						fontColor="#FFFFFF" @click="shareImageMenu">
						<text class="">分享给微信好友</text>
					</tn-button> -->
					<tn-button class="tn-button tn-button3" shape="round" padding="40rpx 0" width="100%" :fontSize="28"
						fontColor="#FFFFFF" openType="share">
						<text class="">分享链接</text>
					</tn-button>
				</view>
			</view>
		</view>
		<tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	import customerNotice from "@/components/customerNotice";
	import store from '@/store/index.js'
	export default {
		name: 'TemplatePending',
		mixins: [template_page_mixin],
		components: {
		  customerNotice
		},
		data() {
			return {
				userData:'',
				avatar:'',
				distributorCodeUrl:'',
				pzImg:''
			}
		},
		onLoad(options) {
			console.log(options)
			console.log(options.scene)
			console.log(decodeURIComponent(options.scene).split('=')[1])
			if(options.scene){
			  store.commit('$tStore', {
			  	name: 'distribution_code',
			  	value: decodeURIComponent(options.scene).split('=')[1]
			  })
			}
		},
		onShow() {
			this.getuser();
		},
		methods: {
			genQrCode(){
				
				    uni.getImageInfo({
				        src: this.userData.avatar,
				        success: (url) => {
				            console.log(url)
							this.avatar = url.path
							
							uni.getImageInfo({
							    src: this.userData.distributorCodeUrl,
							    success: (url1) => {
							        console.log(url1)
									this.distributorCodeUrl = url1.path
									
								 const ctx = wx.createCanvasContext('shareCanvas');
								
								    // 画布尺寸
								    const canvasWidth = 300;
								    const canvasHeight = 400;
								
								    // 背景色
								    ctx.setFillStyle('#ffffff');
								    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
								
								    // 绘制头像
								    const avatarUrl = this.avatar; // 替换为实际头像URL
								    const avatarSize = 60; // 头像大小
								    const avatarX = 30; // 头像左边距
								    const avatarY = 30; // 头像上边距
								    ctx.save();
								    ctx.beginPath();
								    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI); // 圆形头像
								    ctx.clip();
								    ctx.drawImage(avatarUrl, avatarX, avatarY, avatarSize, avatarSize);
								    ctx.restore();
								
								    // 绘制昵称
								    const nickname = this.userData.nickname; // 替换为实际昵称
								    const nicknameX = avatarX + avatarSize + 20; // 昵称左边距
								    const nicknameY = avatarY + avatarSize / 2 + 10; // 昵称垂直居中
								    ctx.setFontSize(18);
								    ctx.setFillStyle('#333333');
								    ctx.setTextAlign('left');
								    ctx.fillText(nickname, nicknameX, nicknameY);
									
									// 绘制分割线
									ctx.setStrokeStyle('#eeeeee');
									ctx.setLineWidth(1);
									ctx.moveTo(20, 120);
									ctx.lineTo(280, 120);
									ctx.stroke();
								
								    // 绘制二维码
								    const qrCodeUrl = this.distributorCodeUrl; // 替换为实际二维码URL
								    const qrCodeSize = 200; // 二维码大小
								    const qrCodeX = (canvasWidth - qrCodeSize) / 2; // 二维码水平居中
								    const qrCodeY = avatarY + avatarSize + 50; // 二维码与头像的间距
								    ctx.drawImage(qrCodeUrl, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
								
								    // 绘制提示文字
								    const tipText = '扫描二维码进入简一膜法小程序';
								    const tipTextX = canvasWidth / 2; // 文字水平居中
								    const tipTextY = qrCodeY + qrCodeSize + 30; // 文字与二维码的间距
								    ctx.setFontSize(14);
								    ctx.setFillStyle('#666666');
								    ctx.setTextAlign('center');
								    ctx.fillText(tipText, tipTextX, tipTextY);
								
								    // 绘制完成
								    ctx.draw(true, () => {  
										uni.canvasToTempFilePath({  
										  canvasId: 'shareCanvas',  
										  success: (res) => {  
											console.log('图片路径:', res.tempFilePath);  
											// 可以在这里使用图片路径，如预览、上传等  
											this.pzImg = res.tempFilePath
										  },  
										  fail: (err) => {  
											console.error('导出图片失败:', err);  
										  }  
										});  
									  });  
									
							    },
							    fail: (err) => {
							        console.log('err===', err)
							        showToast(err)
							    }
							});
				        },
				        fail: (err) => {
				            console.log('err===', err)
				            showToast(err)
				        }
				    });
			},
			getuser(){
				this.$http.getRequest('app-api/member/user/get')
				.then(res => {
					if(res.code == 0){
						this.userData = res.data
						this.genQrCode()
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
			saveImage() {
			  uni.getSetting({
			    success: (getRes) => {
			      // 获取授权成功
			      if (getRes.authSetting["scope.writePhotosAlbum"]) {
			        this.saveToAlbum();
			      } else {
			        // 获取授权失败
			        uni.authorize({
			          scope: "scope.writePhotosAlbum",
			          success: () => {
			            this.saveToAlbum();
			          },
			          // 拉起授权通知失败
			          fail: () => {
			            uni.showModal({
			              title: "提示", //提示的标题,
			              content: "未授权保存到相册，是否重新授权？", //提示的内容,
			              showCancel: true, //是否显示取消按钮,
			              cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
			              cancelColor: "#000000", //取消按钮的文字颜色,
			              confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
			              confirmColor: "#3CC51F", //确定按钮的文字颜色,
			              success: (res) => {
			                if (res.confirm) {
			                  uni.openSetting({
			                    success: () => {
			                      this.saveToAlbum();
			                    },
			                  });
			                }
			              },
			            });
			          },
			        });
			      }
			    },
			  });
			},
			saveToAlbum() {
				let that =this
				  uni.getImageInfo({
				  src: that.pzImg,
					success: function(res) {
					let path = res.path;
					console.log(res.path)
					 uni.saveImageToPhotosAlbum({
					filePath: path,
					success(res) {
					   that.$refs.toast.show({
						 title: '保存成功',
						 icon: 'success',
						 image: '',
						 duration: 1500
					   })
				  },
					fail(res) {
						that.$refs.tips.show({
						  msg: '保存失败',
						  backgroundColor: '#E83A30',
						  fontColor: '#FFFFFF',
						  duration: 1500
						})
						 }
					  })
					}
				   })
			},
			shareImageMenu(){
				let that =this
				uni.getImageInfo({
				src: that.pzImg,
				success: function(res) {
					uni.showShareImageMenu({
					  path: res.path,
					  success(res) {
					  },
					  fail(res) {
							that.$refs.tips.show({
								 msg: '分享失败',
								backgroundColor: '#E83A30',
								fontColor: '#FFFFFF',
								duration: 1500
							})
						}
					});
				},
				fail(res) {
						that.$refs.tips.show({
							msg: '分享失败',
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
		padding-bottom: 120rpx;
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
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	

	/* 底部悬浮按钮 end*/
	
	.d-2{
		text-align: center;
		padding: 30rpx 0;
		padding-top: 50rpx;
	}
	.d-4{
		font-size: 40rpx;
		color: $tn-font-title-color;
		font-weight: bold;
		margin: 20rpx 0;
	}
	.d-5{
		color: $tn-middle-color;
	}
	.d-7{
		padding: 20rpx;
		border-radius: 16rpx;
		background: #FFFFFF;
		margin-top: 50rpx;
		margin-left: -50rpx;
		width: calc(100% + 100rpx);
	}
	.d-8{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	::v-deep  .tn-button button{
		margin-top: 100rpx;
		background: linear-gradient(130.69deg, #0059FF 0%, #004AD4 100%);
		// box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
	}
	::v-deep  .tn-button1 button{
		margin-top: 50rpx;
		background: transparent !important;
		box-shadow: none;
		color: $tn-middle-color !important;
		border: 2rpx solid $tn-middle-color;
	}
	::v-deep  .tn-button2 button{
		margin-top: 50rpx;
		background: white !important;
		box-shadow: none;
		color: $tn-font-title-color !important;
		
	}
	::v-deep  .tn-button3 button{
		margin-top: 50rpx;
		background: #00091A !important;
		box-shadow: none;
		
	}
	::v-deep  .tn-icon-close-fill{
		font-size: 36rpx !important;
		color: $tn-font-title-color !important;
	}
	.h-1{
		margin-top: 50rpx;
	}
	.h-2{
		position: relative;
		top: -60rpx;
	}
	.h-3{
		width: 128rpx;
		height: 128rpx;
		border-radius: 16rpx;
		border: 2rpx solid #000000;
	}
	.h-4{
		margin-top: 15rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: $tn-font-title-color;
	}
	.h-5{
		width: 418rpx;
		height: 428rpx;
		border-radius: 16rpx;
		margin-top: -28rpx;
	}
</style>