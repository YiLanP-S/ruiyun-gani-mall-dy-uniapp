<template>
  <view v-if="openModal" class="wx-authorization-modal">
    <view class="wam__mask" @touchmove.prevent="" @tap.stop="closeModal"></view>

    <!-- 内容区域 -->
    <view class="wam__wrapper">
      <!-- 关闭按钮 -->
      <view class="wam__close-btn" @tap.stop="closeModal">
        <text class="tn-icon-close"></text>
      </view>
      <!-- 标题 -->
      <view class="wam__title">获取您的昵称、头像</view>
      <!-- tips -->
      <view class="wam__sub-title"> 获取用户头像、昵称，主要用于向用户提供具有辨识度的用户中心界面 </view>

      <!-- 头像选择 -->
      <!--     <view class="wam__avatar">
        <view class="button-shadow">
          <button
            class="button"
            open-type="chooseAvatar"
            @chooseavatar="chooseAvatarEvent"
          >
            <view v-if="userInfo.avatar" class="avatar__image">
              <image class="image" :src="userInfo.avatar" mode="aspectFill"></image>
            </view>
            <view v-else class="avatar__empty">
              <image class="image" src="@/static/tx_img.png" mode="aspectFill"></image>
            </view>
            <view class="avatar--icon">
              <view class="tn-icon-camera-fill"></view>
            </view>
          </button>
        </view>
      </view>
      <view class="wam__nickname">
        <view class="nickname__data">
          <input class="input" type="nickname" v-model="userInfo.nickname" placeholder="请输入昵称" placeholder-style="color: #AAAAAA;" @input="nicknameInput" @confirm="nicknameConfirm">
        </view>
      </view> -->

      <!-- 保存按钮 -->
      <!--  <button
	    class="wam__submit-btn"
	  		open-type="getPhoneNumber"
	    hover-class="tn-btn-hover-class"
	    :hover-stay-time="150"
	  		@getphonenumber="onGetphonenumber"
	  >
	    授权登录
	  </button> -->
      <button class="wam__submit-btn" hover-class="tn-btn-hover-class" :hover-stay-time="150" @click="getUserInfo" v-if="!isAuthorizeUserInfo" style="margin-top: 0">授权头像昵称</button>
      <button class="wam__submit-btn" open-type="getPhoneNumber" hover-class="tn-btn-hover-class" :hover-stay-time="150" @getphonenumber="onGetphonenumber" style="margin-top: 0" v-else>授权手机号</button>
      <view class="p-5">
        <tn-checkbox v-model="isAgree" activeColor="#0059FF"></tn-checkbox>请先阅读<text @click="tn('/pages/singlePage/singlePage?title=用户服务协议')">《用户服务协议》</text>和<text @click="tn('/pages/singlePage/singlePage?title=隐私协议')"
          >《隐私协议》</text
        >
      </view>
    </view>
    <tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
    <view class="tips" v-if="tipsShow">
      {{ tipsMessage }}
    </view>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import store from '../../../../store/index.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openModal: false,
      userInfo: {
        avatar: '',
        nickname: '',
      },
      isAgree: false,
      isAuthorizeUserInfo: false,
      tipsShow: false,
      tipsMessage: '',
    }
  },
  watch: {
    value: {
      handler(val) {
        this.openModal = val
      },
      immediate: true,
    },
  },

  methods: {
    // 头像选择
    chooseAvatarEvent(e) {
      uni.showLoading({
        title: '上传中',
      })
      uni.uploadFile({
        url: this.$http.commoneUrl + 'app-api/infra/file/upload',
        filePath: e.detail.avatarUrl,
        name: 'file',
        header: {
          // Accept: 'text/json',
          Accept: '*/*',
          'tenant-id': '1',
          // Authorization:  'Bearer test247',
        },
        success: uploadFileRes => {
          let result = JSON.parse(uploadFileRes.data)
          if (result.error === 1) {
            this.$refs.tips.show({
              msg: result.msg,
              backgroundColor: '#E83A30',
              fontColor: '#FFFFFF',
              duration: 1500,
            })
          } else {
            this.userInfo.avatar = result.data
          }
        },
        fail: error => {
          console.log('上传失败：', error)
          return resolve(false)
        },
        complete: () => {
          uni.hideLoading()
        },
      })
    },
    getUserInfo() {
      if (!this.isAgree) {
        console.log(this.$refs)
        // this.$refs.tips.show({
        //   msg: '请先阅读协议',
        //   backgroundColor: '#E83A30',
        //   fontColor: '#FFFFFF',
        //   duration: 1500
        // })
        this.tipsMessage = '请先阅读协议'
        this.tipsShow = true
        setTimeout(() => {
          this.tipsShow = false
        }, 1500)
        return
      }
      let that = this
      uni.getUserProfile({
        success(res) {
          console.log('getUserProfile 调用成功：', res.userInfo)
          that.isAuthorizeUserInfo = true
          console.log('getUserProfile 调用成功：', that.$http.commoneUrl)

          uni.getImageInfo({
            src: res.userInfo.avatarUrl,
            success: url => {
              uni.uploadFile({
                url: that.$http.commoneUrl + 'app-api/infra/file/upload',
                filePath: url.path,
                name: 'file',
                header: {
                  // Accept: 'text/json',
                  Accept: '*/*',
                  'tenant-id': '1',
                  // Authorization:  'Bearer test247',
                },
                success: uploadFileRes => {
                  let result = JSON.parse(uploadFileRes.data)
                  if (result.error === 1) {
                    that.$refs.tips.show({
                      msg: result.msg,
                      backgroundColor: '#E83A30',
                      fontColor: '#FFFFFF',
                      duration: 1500,
                    })
                  } else {
                    that.userInfo.avatar = result.data
                  }
                },
                fail: error => {
                  console.log('上传失败：', error)
                  return resolve(false)
                },
                complete: () => {
                  uni.hideLoading()
                },
              })
            },
            fail: err => {
              console.log('err===', err)
            },
          })

          that.userInfo.nickname = res.userInfo.nickName
        },
        fail(res) {
          console.log('getUserProfile 调用失败', res)
        },
      })
    },
    // 更新用户信息
    onGetphonenumber(e) {
      // 判断是否已经选择了用户头像和输入了用户昵称
      console.log('this.userInfo', this.userInfo)
      console.log('e', e)

      if (!this.isAgree) {
        this.tipsMessage = '请先阅读协议'
        this.tipsShow = true
        setTimeout(() => {
          this.tipsShow = false
        }, 1500)
        return
      }
      uni.login({
        provider: 'toutiao',
        success: res => {
          let code = res.code
          console.log('微信授权登录wxlogin:', code)
          console.log('微信授权登录e:', e)

          if (e.detail.errMsg == 'getPhoneNumber:ok') {
            this.$http
              .postRequest('app-api/member/auth/douyin-mini-app-login', {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                loginCode: code,
                state: 'default',
              })
              .then(res => {
                console.log('mobile', res.data.mobile)
                uni.setStorageSync('token', res.data.accessToken)
                uni.setStorageSync('mobile', res.data.mobile)
                uni.setStorageSync('openid', res.data.openid)
                uni.setStorageSync('userId', res.data.userId)
                uni.setStorageSync('isDistributor', res.data.isDistributor)

                // 更新完成事件
                this.$emit('updated', this.userInfo)
                this.$http.putNewRequest('app-api/member/user/update', this.userInfo).then(res => {
                  if (res.code == 0) {
                    store.commit('$tStore', {
                      name: 'loginShow',
                      value: false,
                    })
                  } else {
                    this.tipsMessage = res.msg
                    this.tipsShow = true
                    setTimeout(() => {
                      this.tipsShow = false
                    }, 1500)
                  }
                })
              })
              .catch(res => {})
          } else {
            if (e.detail.errMsg === 'getPhoneNumber:fail Internal error: phoneArray is empty' || e.detail.errMsg === 'getPhoneNumber:fail Internal error:') {
              this.tipsMessage = '请切换抖音账号，使用个人抖音账号下单'
              this.tipsShow = true
              setTimeout(() => {
                this.tipsShow = false
              }, 1500)
              return
            } else {
              this.tipsMessage = '手机号授权失败,请重新授权'
              this.tipsShow = true
              setTimeout(() => {
                this.tipsShow = false
              }, 1500)
              return
            }
          }
        },
      })
    },

    // 关闭弹框
    closeModal() {
      //   console.log(this)
      // this.closeLogin()
      console.log(1111)
      store.commit('$tStore', {
        name: 'loginShow',
        value: false,
      })
    },
    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
    nicknameInput(e) {
      console.log('e', e)
    },
    nicknameConfirm(e) {
      console.log('e', e)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../static/iconfont.css';

.wx-authorization-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99998;

  view {
    box-sizing: border-box;
  }

  .image {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .wam {
    /* mask */
    &__mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      animation: showMask 0.25s ease 0.1s forwards;
    }

    /* close-btn */
    &__close-btn {
      position: absolute;
      top: 30rpx;
      right: 30rpx;
      z-index: 99999;
    }

    /* wrapper */
    &__wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #ffffff;
      border-radius: 20rpx 20rpx 0rpx 0rpx;
      padding: 40rpx;
      padding-top: 60rpx;
      padding-bottom: 40rpx;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 40rpx);
      padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
      transform-origin: center bottom;
      transform: scaleY(0);
      animation: showWrapper 0.25s ease 0.1s forwards;
      z-index: 99999;
    }

    /* title */
    &__title {
      font-size: 34rpx;
    }
    /* sub-title */
    &__sub-title {
      font-size: 26rpx;
      color: #aaaaaa;
      margin-top: 16rpx;
      padding-bottom: 30rpx;
    }

    /* 头像选择 */
    &__avatar {
      width: 100%;
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .button-shadow {
        border: 8rpx solid rgba(255, 255, 255, 0.05);
        box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
        border-radius: 50%;
      }

      .button {
        position: relative;
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        overflow: visible;
        background-image: repeating-linear-gradient(45deg, #e4e9ec, #f8f7f8);
        color: #ffffff;
        background-color: transparent;
        padding: 0;
        margin: 0;
        font-size: inherit;
        line-height: inherit;
        border: none;
        &::after {
          border: none;
        }
      }

      .avatar {
        &__empty,
        &__image {
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }

        &--icon {
          position: absolute;
          right: -10rpx;
          bottom: -6rpx;
          width: 60rpx;
          height: 60rpx;
          // transform: translate(50%, 50%);
          background-color: #1d2541;
          color: #ffffff;
          border-radius: 50%;
          border: 6rpx solid #ffffff;
          line-height: 1;
          font-size: 36rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    /* 昵称 */
    &__nickname {
      margin-top: 40rpx;

      .nickname {
        &__data {
          margin-top: 16rpx;
          width: 100%;
          padding: 26rpx 20rpx;
          border-radius: 10rpx;
          background-color: #f8f7f8;

          .input {
            color: #080808;
          }
        }
      }
    }

    /* 保存按钮 */
    &__submit-btn {
      width: 100%;
      background-color: #0059ff;
      color: #ffffff;
      margin-top: 60rpx;
      border-radius: 10rpx;
      // padding: 25rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50rpx;
      &.disabled {
        background-color: #e6e6e6;
      }
    }
  }
}

.tn-btn-hover-class {
  box-shadow: inset 10rpx 2rpx 40rpx 0rpx rgba(0, 0, 0, 0.05);
}

@keyframes showMask {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes showWrapper {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
.p-5 {
  margin-top: 35rpx;
  color: #999999;
  font-size: 24rpx;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.p-5 text {
  color: #00091a;
}
::v-deep  .tn-checkbox__label {
  margin-right: 10rpx !important;
}
::v-deep  .tn-button2 button {
  margin-top: 30rpx;
  background: white !important;
  box-shadow: none;
  color: $tn-font-title-color !important;
}
.tips {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  background-color: #e83a30;
  color: white;
  padding: 9px 15px !important;
}
</style>
