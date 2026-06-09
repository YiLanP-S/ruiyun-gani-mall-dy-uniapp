<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'20px':0}">
	<!-- 	<view class="a-0" :style="{height: vuex_custom_bar_height + 'px'}">
			<image src="https://www.tmsglm.com/statics/top_bg.jpg" style="width: 100%;height: 100%;"></image>
			<tn-nav-bar backgroundColor="transparent" :backTitle="backTitle">
				{{title}}
			</tn-nav-bar>
		</view> -->
		<view class="tn-padding-bottom-xl" v-if="!url">
			<view class="content-box">
				<rich-text :nodes="nodes"></rich-text>
			</view>
		</view>
		<web-view v-else :src="url"></web-view>
		<tn-tips ref="tips" position="center"></tn-tips>
		<tn-toast ref="toast"></tn-toast>
	</view>
</template>

<script>
	import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
	export default {
		name: 'TemplateIntegral',
		mixins: [template_page_mixin],
		data() {
			return {
				title:'',
				nodes: '',
				url:''
			}
		},
		onLoad(options) {
			if(options.title){
				this.title = options.title
				uni.setNavigationBarTitle({
					title:options.title
				})
			}
			if(options.url){
				this.url = options.url
			}
			if(this.title=="用户服务协议"){
				this.nodes = [  
				   {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第一章定义与解释"}]}, 
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.协议范围：本协议适用于简一膜法小程序，规范用户（以下简称“您”或“用户”）与小程序开发者/运营者（以下简称“我们”或“开发者”）之间的权利义务关系。"}]},  
						    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第二章用户权利与义务"}]},  
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.账号注册：用户应提供真实、准确、完整的个人信息进行注册，并自行负责个人信息的保密。"}]},  
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2.合法使用：用户应遵守国家法律法规和微信平台的相关规定，合法使用小程序。"}]},
							{"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第三章 服务内容"}]},
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 我们将向您提供小程序的使用服务，包括但不限于信息展示、商品交易、互动交流等功能。"}]},  
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 我们将努力确保小程序的稳定运行，但不保证服务的连续性和无故障性。"}]}, 
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3. 我们有权根据实际情况调整小程序的服务内容，但应提前通知用户。"}]}, 
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "4. 对于因服务调整给用户带来的不便，我们深表歉意，并将尽力减少影响。"}]}, 
							{"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第四章 隐私保护"}]},
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 我们将收集用户的个人信息以提供服务和优化用户体验，但仅会在合法、必要和明确告知用户的前提下进行。"}]},  
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 我们承诺保护用户隐私，不会泄露用户个人信息给第三方（除非法律法规要求或用户授权）。"}]}, 
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3. 用户在小程序内的操作行为，可能会被我们记录并用于改善小程序服务质量。"}]}, 
							  // 第五章  
							    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第五章 免责声明"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.因不可抗力、黑客攻击等非人为因素导致的小程序服务中断或数据丢失，我们不承担任何责任。"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 我们不对小程序内第三方提供的内容（如广告、用户发布的信息等）负责，用户应自行判断其真实性和合法性。"}]},
								// 第六章  
							    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第六章  争议解决"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 双方因本协议发生争议时，应首先通过友好协商解决。"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 本协议的订立、执行和解释均适用中华人民共和国法律。"}]},  
								 {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3. 因本协议引起的或与本协议有关的任何争议，双方应提交至我们所在地人民法院诉讼解决。"}]},  
							    // 第七章  
							    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "第七章 其他"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 我们有权随时修改本协议，并在小程序内公示。用户继续使用小程序即表示同意遵守修改后的协议。"}]},  
							    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 本协议的解释权归我们所有。"}]},  
				  ]
				  }
		if(this.title=="隐私协议"){
			this.nodes = [  
			   {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "一、协议概述"}]}, 
					    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.本隐私协议（以下简称“协议”）旨在明确简一膜法小程序在收集、使用、保存、共享及保护用户个人信息方面的政策及做法。请用户在使用本小程序前，仔细阅读并理解本协议内容。"}]},  
					    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "二、信息收集"}]},  
					    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.用户授权同意：小程序在收集用户的个人信息前，将明确告知信息收集的目的、范围及用途，并在获得用户明示同意后，方可进行收集。"}]},  
					    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2.收集的信息类型：包括但不限于用户的微信昵称、头像、位置信息（用于显示距离）、手机号（用于登录或注册）、微信运动步数（用于用户互动）、发票信息（用于维护消费功能）、车牌号（特定情况下用于用户互动）、订单信息（用于完成订单相关服务）等。"}]},
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3.敏感信息：对于用户的敏感信息（如身份证号、银行账号等），小程序仅在法律法规允许且用户明确同意的情况下收集，并采取更加严格的安全措施进行保护。"}]},
						{"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "三、信息使用"}]},
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.服务提供：小程序收集的个人信息将主要用于向用户提供更加个性化、精准的服务。"}]},  
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2.服务改进：小程序还可能使用收集到的信息进行用户需求分析和服务改进，以提升用户体验。"}]}, 
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3.合法使用：小程序承诺仅在法律法规允许的范围内使用用户个人信息，并严格遵守相关法律法规及政策要求。"}]},
						{"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "四、信息保存与共享"}]},
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 信息安全：小程序将采取合理的技术手段和管理措施，保护用户个人信息的安全，防止非法访问、泄露、破坏、篡改等风险。"}]},  
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "2. 信息存储：用户个人信息将被存储在采取了适当安全措施的可信服务器上。"}]}, 
						{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "3. 信息共享：小程序原则上不与第三方共享或提供用户的个人信息。"}]}, 
						  // 第五章  
						    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "五、未成年人保护"}]},  
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1.小程序不应有意收集未成年人的个人信息。未成年人请在得到监护人同意后使用小程序。"}]},
							// 第六章  
						    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "六、用户权利"}]},  
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 用户有权随时查询、更正或删除自己的个人信息。如有需要，请通过小程序内提供的联系方式或微信官方渠道联系我们。"}]},  
						    // 第七章  
						    {"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "七、协议变更"}]},  
						    {"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 本协议的任何变更或更新，将在小程序内或通过其他适当的方式通知用户。用户应定期查看并了解本协议的最新内容。"}]},
							{"name": "strong", "attrs": {}, "children": [{"type": "text", "text": "八、联系方式"}]},
							{"name": "p", "attrs": {}, "children": [{"type": "text", "text": "1. 如有关于本协议或用户个人信息保护的任何疑问或建议，请联系我们：[填写具体联系方式，如邮箱、电话等。]"}]},
			  ] 
		}
		},
		onShareAppMessage() {
			if(this.url){
				return {
				  title: '武汉简一',                //分享的标题
				  path: '/pages/singlePage/singlePage?url=https://www.tmsglm.com:48804/#/',      //点击分享链接之后进入的页面路径
				  imageUrl: 'https://www.tmsglm.com/shop/share_1.png' //分享发送的链接图片地址
				};
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.oa-content {
		background-color: #F8F7F8;
		min-height: 100vh;
		padding-bottom: 60rpx;
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom) / 2);
		padding-bottom: calc(80rpx + constant(safe-area-inset-bottom));
		padding-bottom: 120rpx;
	}
	.a-0{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.content-box{
		padding: 30rpx;
	}
</style>