export default {
	data() {
		return {}
	},
	//1.配置发送给朋友
	onShareAppMessage() {
	let path = '/pages/index/index'
	if(uni.getStorageSync('isDistributor')){
		path='/pages/index/index?scene=' + encodeURIComponent('distributor='+uni.getStorageSync('userId'))
	}
    return {
      title: '简一膜法',                //分享的标题
      path: path,      //点击分享链接之后进入的页面路径
      imageUrl: 'https://www.tmsglm.com/shop/share_1.png' //分享发送的链接图片地址
    };
  },
	//2.配置分享到朋友圈
	onShareTimeline(){
	let path = '/pages/index/index'
	let query = ''
	if(uni.getStorageSync('isDistributor')){
		path='/pages/index/index?scene=' + encodeURIComponent('distributor='+uni.getStorageSync('userId'))
		query = 'scene=' + encodeURIComponent('distributor='+uni.getStorageSync('userId'))
	}
    return{
      title: '简一膜法',                //分享的标题
      query: query,     //点击分享链接之后进入的页面路径
      imageUrl: 'https://www.tmsglm.com/shop/share_1.png' //分享发送的链接图片地址
    }
  },
}