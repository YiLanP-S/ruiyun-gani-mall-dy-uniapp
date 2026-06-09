<template>
	<view class="oa-content" :style="{paddingBottom:vuex_is_black_stripe?'calc(20px + 120rpx)':'120rpx'}">
		<!-- 顶部自定义导航 -->

		<view>


			<view class="tn-flex tn-flex-row-between tn-strip-bottom-min tn-padding" @click="tn('/minePages/avatar')">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						用户头像
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						有趣的头像，百里挑一
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey" style="font-size: 0;">
					<button class="logo-pic tn-shadow" open-type="chooseAvatar" @chooseavatar="chooseAvatarEvent">
						<view class="logo-image">
							<tn-image-upload :customBtn="true" :deleteable="false" :showUploadList="false"  :showProgress="false"  :action="action" @on-success="avartSuccess">
								<view slot="addBtn" class="tn-image-upload__custom-btn" hover-class="tn-hover-class"
									hover-stay-time="150">
                  <view class="tn-shadow-blur">
                    <image :src="userData.avatar ? userData.avatar :'/static/tx_img.png'" ></image>
									</view>
								</view>
							</tn-image-upload>
						</view>
					</button>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-strip-bottom-min tn-padding" @click="showModal1">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						昵称
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{userData.nickname}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<tn-modal v-model="show1" :custom="true" :showCloseBtn="true">
				<view class="custom-modal-content">
					<view class="">
						<view class="tn-text-lg tn-text-bold tn-color-purplered tn-text-center tn-padding">修改姓名</view>
						<view class="tn-bg-gray--light"
							style="border-radius: 10rpx;padding: 20rpx 30rpx;margin: 50rpx 0 60rpx 0;">
							<input placeholder="输入姓名" type="nickname" v-model="name" @input="nicknameInput" @confirm="nicknameConfirm" placeholder-style="color:#AAAAAA"
								maxlength="20"></input>
						</view>
					</view>
					<view class="tn-flex-1 justify-content-item tn-margin-sm tn-text-center">
						<tn-button backgroundColor="#0059FF" shape="round" padding="40rpx 0" width="60%" shadow fontBold @click="xingming">
							<text class="tn-color-white">保 存</text>
						</tn-button>
					</view>
				</view>
			</tn-modal>
			<tn-tips ref="tips" position="center" zIndex="999999999"></tn-tips>
		</view>
	</view>
</template>

<script>
import template_page_mixin from "@/libs/mixin/template_page_mixin.js";
export default {
  name: "TemplateSet",
  mixins: [template_page_mixin],
  data() {
    return {
      userData: {
        avatar: "",
        nickname: "",
      },
      show1: false,
      show2: false,
      name: "",
      action: "",
    };
  },
  onShow() {
    this.action = this.$http.commoneUrl + "app-api/infra/file/upload";
    this.getuser();
  },
  methods: {
    getuser() {
      this.$http.getRequest("app-api/member/user/get").then((res) => {
        this.userData = {
          avatar: res.data.avatar,
          nickname: res.data.nickname,
        };
        // console.log(res)
      });
    },
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      });
    },

    // 弹出模态框
    showModal1(event) {
      this.openModal1();
    },
    // 打开模态框
    openModal1() {
      this.show1 = true;
      this.name = this.userData.nickname;
    },

    // 弹出模态框
    showModal2(event) {
      this.openModal2();
    },
    // 打开模态框
    openModal2() {
      this.show2 = true;
    },

    // 弹出模态框
    showModal3(event) {
      this.openModal3();
    },
    // 打开模态框
    openModal3() {
      this.show3 = true;
    },
    // nicknameInput(e){
    // 	console.log('this.name',this.name)
    // 	// this.userData.nickname=;
    // },
    // nicknameConfirm(){
    // 	console.log('this.name',this.name)
    // },
    xingming() {
      if (this.name === "") {
        this.$refs.tips.show({
          msg: "昵称不能为空",
          backgroundColor: "#E83A30",
          fontColor: "#FFFFFF",
          duration: 1500,
        });
        return;
      }
      this.userData.nickname = this.name;
      this.updatedUserInfoEvent();
      this.show1 = false;
    },

    // 头像选择
    chooseAvatarEvent(e) {
      uni.showLoading({
        title: "上传中",
      });
      uni.uploadFile({
        url: this.$http.commoneUrl + "app-api/infra/file/upload",
        filePath: e.detail.avatarUrl,
        name: "file",
        header: {
          // Accept: 'text/json',
          Accept: "*/*",
          "tenant-id": "1",
          // Authorization:  'Bearer test247',
        },
        success: (uploadFileRes) => {
          let result = JSON.parse(uploadFileRes.data);
          if (result.error === 1) {
            this.$refs.tips.show({
              msg: result.msg,
              backgroundColor: "#E83A30",
              fontColor: "#FFFFFF",
              duration: 1500,
            });
          } else {
            this.userData.avatar = result.data;
            this.updatedUserInfoEvent();
          }
        },
        fail: (error) => {
          console.log("上传失败：", error);
          return resolve(false);
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    // 获取到的用户信息
    updatedUserInfoEvent() {
      let that = this;
      that.$http
        .putNewRequest("app-api/member/user/update", that.userData)
        .then((res) => {
          if (res.code == 0) {
            that.loginShow = false;
            that.getuser();
          } else {
            this.$refs.tips.show({
              msg: res.msg,
              backgroundColor: "#E83A30",
              fontColor: "#FFFFFF",
              duration: 1500,
            });
          }
        });
    },
    avartSuccess(data, index, lists, name) {
      this.userData.avatar = JSON.parse(JSON.stringify(lists[0].response.data));
      this.updatedUserInfoEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
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
  color: #ffffff;
  font-size: 18px;

  .icon {
    display: block;
    flex: 1;
    margin: auto;
    text-align: center;
  }
}

/* 间隔线 start*/
.tn-strip-bottom-min {
  width: 100%;
  border-bottom: 1rpx solid #f8f9fb;
}

.tn-strip-bottom {
  width: 100%;
  border-bottom: 20rpx solid rgba(241, 241, 241, 0.8);
}

/* 间隔线 end*/

/* 用户头像 start */
.logo-image {
  width: 80rpx;
  height: 80rpx;
  position: relative;
}

.logo-pic {
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: top;
  border: 2rpx solid rgba(255, 255, 255, 0.05);
  box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
  border-radius: 16rpx;
  overflow: hidden;
  // background-color: #FFFFFF;
  border-radius: 100%;
  padding: 0;
}

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

/* 底部悬浮按钮 end*/

.a-0 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.tn-shadow-blur {
  width: 80rpx;
  height: 80rpx;
  background-color: #999;
  border-radius: 50%;
  image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }
}
</style>