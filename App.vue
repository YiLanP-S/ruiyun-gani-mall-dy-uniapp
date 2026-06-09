<script>
import Vue from 'vue'
import store from './store/index.js'
import updateCustomBarInfo from './tuniao-ui/libs/function/updateCustomBarInfo.js'

export default {
  onLaunch: function (list) {
    // this.initShare();
    uni.getSystemInfo({
      success: function (e) {
        // 获取手机系统版本
        const system = e.system.toLowerCase()
        const platform = e.platform.toLowerCase()
        // 判断是否为ios设备
        if (platform.indexOf('ios') != -1 && (system.indexOf('ios') != -1 || system.indexOf('macos') != -1)) {
          Vue.prototype.SystemPlatform = 'apple'
        } else if (platform.indexOf('android') != -1 && system.indexOf('android') != -1) {
          Vue.prototype.SystemPlatform = 'android'
        } else {
          Vue.prototype.SystemPlatform = 'devtools'
        }
        // let modelmes = e.model;
        // let iphoneArr = ['iPhone X', 'iPhone 11','iPhone 11 Pro Max','iPhone XS','iPhone XS Max','iPhone XR','iPhone 11 Pro','iPhone 12 mini','iPhone 12','iPhone 12 Pro','iPhone 12 Pro Max','iPhone13 mini','iPhone 13','iPhone13 Pro','iPhone13 Pro Max']
        // iphoneArr.forEach(function (item) {
        //     if (modelmes.search(item) != -1) {
        //         store.commit('$tStore', {
        //         	name: 'vuex_is_black_stripe',
        //         	value: true
        //         })
        //     }
        // })
        const systemInfo = uni.getSystemInfoSync()
        const isIPhoneX = systemInfo.screenHeight - systemInfo.safeArea.bottom > 0
        console.log('isIPhoneX', isIPhoneX)
        if (isIPhoneX) {
          store.commit('$tStore', {
            name: 'vuex_is_black_stripe',
            value: true,
          })
        } else {
          console.log('当前设备不是 iPhone X 及以后的版本')
        }
      },
    })
    // 获取设备的状态栏信息和自定义顶栏信息
    // store.dispatch('updateCustomBarInfo')
    updateCustomBarInfo().then(res => {
      store.commit('$tStore', {
        name: 'vuex_status_bar_height',
        value: res.statusBarHeight,
      })
      store.commit('$tStore', {
        name: 'vuex_custom_bar_height',
        value: res.customBarHeight,
      })
    })

    // #ifdef MP-WEIXIN
    //更新检测
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager &&
        updateManager.onCheckForUpdate(res => {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(() => {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备就绪，是否需要重新启动应用？',
                success: res => {
                  if (res.confirm) {
                    uni.clearStorageSync() // 更新完成后刷新storage的数据
                    console.log(`清除缓存删除成功`)
                    updateManager.applyUpdate()
                  }
                },
              })
            })

            updateManager.onUpdateFailed(() => {
              uni.showModal({
                title: '已有新版本上线',
                content: '小程序自动更新失败，请删除该小程序后重新搜索打开哟~~~',
                showCancel: false,
              })
            })
          } else {
            //没有更新
          }
        })
    } else {
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请更新到最新的微信后再重试。',
        showCancel: false,
      })
    }
    // #endif

    if (uni.getStorageSync('token')) {
      let that = this
      that.$http.getRequest('app-api/trade/cart/list').then(res => {
        if (res.code == 0) {
          let validList = res.data.validList
          if (validList.length > 0) {
            validList.forEach((item, index) => {
              let count = parseFloat((item.count / 10000).toFixed(2))
              item.count = count
            })
          }
          store.commit('$tStore', {
            name: 'cartList',
            value: validList,
          })
        } else {
          this.$refs.tips.show({
            msg: res.msg,
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 1500,
          })
        }
      })
    }

    // const { screenHeight, safeArea } = uni.getSystemInfoSync();
    // console.log(safeArea)
    // console.log(screenHeight)

    // 在页面的onLoad或其他合适的地方调用

    uni.getSystemInfo({
      success: function (res) {
        // 获取手机顶部状态栏的高度
        const statusBarHeight = res.statusBarHeight || 0

        // 获取导航栏的高度（手机状态栏高度 + 胶囊高度 + 胶囊的上下间距）
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
        const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2

        // 计算顶部图标距离
        const topIconDistance = statusBarHeight + navBarHeight
        store.commit('$tStore', {
          name: 'safeAreaBottom',
          value: topIconDistance,
        })
        // 使用状态栏高度进行布局或其他操作
      },
    })

    this.dictType('dy_phone')
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  methods: {
    // initShare() {
    //       // 设置全局分享
    //       uni.updateShareMenu({
    //         withShareTicket: true,
    //         menus: ['shareAppMessage', 'shareTimeline'],
    //         title: '简一膜法',
    //         path: '/pages/index/index', // 分享的页面路径
    //         imageUrl: 'https://www.tmsglm.com/statics/share_3.png', // 分享的图片
    //         success: function () {
    //           console.log('分享设置成功');
    //         },
    //         fail: function (err) {
    //           console.error('分享设置失败', err);
    //         }
    //       });
    //     }

    // 获取字典
    dictType(payChannelCode) {
      let that = this
      let label = ''
      that.$http.getRequest('app-api/system/dict-data/type?type=' + payChannelCode).then(res => {
        if (res.code == 0) {
          store.commit('$tStore', {
            name: 'kfPhone',
            value: res.data[0].value,
          })
          console.log(res.data[0].value)
        } else {
        }
      })
    },
  },
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import './tuniao-ui/index.scss';
@import './tuniao-ui/iconfont.css';
</style>
