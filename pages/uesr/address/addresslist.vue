<template>
  <view class="container">
    <view class="addres-list" v-if="addresslist.length>0">
      <view class="address-item" v-for="(item, index) in addresslist" :key="index" @click="chooseAddress(item)">
        <view class="contacts">
          <text class="name">{{ item.name }}</text>
          <text class="phone">{{ item.mobile }}</text>
        </view>
        <view class="address">
          <text class="region">{{ item.areaName }}</text>
          <text class="detail">{{ item.detailAddress }}</text>
        </view>
        <view class="line"></view>
        <view class="item-option">
          <view class="_left">
            <label class="item-radio" @click.stop="handleSetDefault(item)">
              <radio class="radio" color="#0059FF" :checked="item.defaultStatus"></radio>
              <text class="text">{{ item.defaultStatus ? '已设为默认' : '设为默认' }}</text>
            </label>
          </view>
          <view class="_right">
            <view class="events">
              <view class="event-item" @click.stop="handleUpdate(item.id)">
                <text class="iconfont icon-edit"></text>
                <text class="title">编辑</text>
              </view>
              <view class="event-item" @click.stop="handleRemove(item.id)">
                <text class="iconfont icon-delete"></text>
                <text class="title">删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
	<view v-if="addresslist.length==0" class="wu">
		 <tn-empty icon="https://www.tmsglm.com/statics/2.png" text="暂无数据"></tn-empty>
	</view>
    <!-- 底部操作按钮 -->
    <view class="footer-fixed">
      <view class="btn-wrapper">
        <view class="btn-item btn-item-main" @click="handleCreate()">添加新地址</view>
      </view>
    </view>
	<tn-modal v-model="deleteInfo.show" :title="deleteInfo.title" :content="deleteInfo.content" :button="deleteInfo.button" @click="clickDelete"></tn-modal>
	<tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
	<tn-toast ref="toast"></tn-toast>
  </view>
</template>

<script>
	
  export default {

    data() {
      return {
        addresslist: [],
		deleteInfo:{
			show:false,
			title: '提示',
			content: '是否删除该收货地址？',
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
		addressId:'',
		isChoose:false
      }
    },

    onShow() {
      // 获取页面数据
      this.getAddressList()
    },
	
	onLoad(options) {
		if(options.isChoose==1){
			this.isChoose = options.isChoose
		}
	},

    methods: {

		
      // 获取收货
      getAddressList() {
        this.$http.getRequest('app-api/member/address/list')
        .then(res => {
        	if(res.code == 0){
        		this.addresslist = res.data
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

      // 列表排序把默认收货地址放到最前
      onReorder() {
        this.addresslist.sort(item => {
          return item.address_default ? -1 : 1
        })
      },
	  // 添加地址
      handleCreate() {
        uni.navigateTo({
        	url: '/pages/uesr/address/editaddress',
        });
      },
	  // 编辑地址
      handleUpdate(addressId) {
		uni.navigateTo({
			url: '/pages/uesr/address/update?id='+ addressId,
		});
      },
	  // 删除地址
      handleRemove(addressId) {
		  this.deleteInfo.show = true
		  this.addressId = addressId
      },
	  clickDelete(e){
	  	if(e.index == 0){
	  		this.deleteInfo.show = false
	  	}
	  	if(e.index == 1){
			this.deleteInfo.show = false
			this.$http.deleteRequest('app-api/member/address/delete?id='+this.addressId)
				.then(res => {
					if(res.code == 0){
						this.$refs.toast.show({
						  title: '已删除',
						  icon: 'success',
						  image: '',
						  duration: 1500
						})
						this.getAddressList()
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
	  // 设置默认地址
      handleSetDefault(item) {
		  if(item.defaultStatus){
			  return
		  }
		  let that = this
		  item.defaultStatus = true
		  that.$http.putRequest('app-api/member/address/update',{},item)
		  	.then(res => {
		  		if(res.code == 0){
		  			that.$refs.toast.show({
		  			  title: '操作成功',
		  			  icon: 'success',
		  			  image: '',
		  			  duration: 1500
		  			})
					that.getAddressList()
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
	  chooseAddress(address){
		  if(this.isChoose==1){
			  let pages = getCurrentPages();
			  let beforePage = pages[pages.length - 2];
			  // beforePage.setData({
			  //   ['addressInfo']:address
			  // })
			  beforePage.$vm.detail.address = address
			  wx.navigateBack()
		  }
	  }
    }
  }
</script>
<style>
	page {
		background-color: #F8F7F8;
	}
</style>
<style lang="scss" scoped>
	.wu{
		margin-top: 25vh;
	}
  .addres-list {
    padding-top: 20rpx;
    // 设置ios刘海屏底部横线安全区域
    padding-bottom: calc(constant(safe-area-inset-bottom) + 140rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
  }

  // 项目内容
  .address-item {
    margin: 20rpx auto 20rpx auto;
    padding: 30rpx 40rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
  }

  .contacts {
    font-size: 30rpx;
    margin-bottom: 16rpx;

    .name {
      margin-right: 16rpx;
    }
  }

  .address {
    font-size: 28rpx;

    .region {
      margin-right: 10rpx;
    }
  }

  .line {
    margin: 20rpx 0;
    border-bottom: 1rpx solid #f3f3f3;
  }

  .item-option {
    display: flex;
    justify-content: space-between;
    height: 48rpx;

    // 单选框
    .item-radio {
      font-size: 28rpx;

      .radio {
        vertical-align: middle;
        transform: scale(0.76)
      }

      .text {
        vertical-align: middle;
      }
    }

    // 操作
    .events {
      display: flex;
      align-items: center;
      line-height: 48rpx;

      .event-item {
        font-size: 28rpx;
        margin-right: 26rpx;
        color: #4c4c4c;

        &:last-child {
          margin-right: 0;
        }

        .title {
          margin-left: 8rpx;
        }
      }
    }

  }


  // 底部操作栏
  .footer-fixed {
    position: fixed;
    bottom: var(--window-bottom);
    left: 0;
    right: 0;
    min-height: 120rpx;
    z-index: 11;
    box-shadow: 0 -4rpx 40rpx 0 rgba(151, 151, 151, 0.24);
    background: #fff;

    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .btn-wrapper {
      height: 120rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
    }

    .btn-item {
      flex: 1;
      font-size: 28rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      border-radius: 50rpx;
    }

    .btn-item-main {
      background: linear-gradient(130.69deg, #0059FF 0%, #004AD4 100%);
    }

  }
</style>
