<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'20px':0}">
	<!-- 	<view class="a-0" :style="{height: vuex_custom_bar_height + 'px'}">
			<image src="https://www.tmsglm.com/statics/top_bg.jpg" style="width: 100%;height: 100%;"></image>
			<tn-nav-bar backgroundColor="transparent" :backTitle="backTitle">
				{{title}}
			</tn-nav-bar>
		</view> -->
		<view class="tn-padding-bottom-xl">
			<view class="content-box">
				<image style="width: 100%;height: auto;" mode="widthFix" src="/static/company.jpg" @click="previewImage('https://www.tmsglm.com/shop/yyzz.jpg')"></image>
			</view>
		</view>
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
			
		},
		methods: {
			previewImage(url){
				uni.previewImage({
					current: url, // 当前显示图片的http链接
					urls: [url] // 需要预览的图片http链接列表
				})
			},
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