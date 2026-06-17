<template>
  <view class="oa-content" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 120rpx)' : '120rpx' }">
    <view class="c-2">
      <view class="c-15" v-for="item in detail.item" :key="item.id">
        <image class="c-16" :src="item.picUrl"></image>
        <view class="c-17">
          <view class="c-18">{{ item.spuName }}</view>
          <view class="c-19-box">
            <view class="c-19" v-for="(item1, index1) in item.properties" :key="index1">{{ item1.propertyName + ':' + item1.valueName }}<text>/</text></view>
          </view>
          <view class="c-20">
            <view class="c-21"
              ><text class="c-23">￥</text><text class="c-24">{{ parseFloat((item.price / 100).toFixed(2)) }}</text></view
            >
            <!-- <view class="c-22">x{{item.count / 10000}}m²</view> -->
          </view>
        </view>
      </view>
    </view>
    <view style="margin-top: 30rpx">
      <canvas canvas-id="afterSaleCanvas" id="afterSaleCanvas" style="width: 710rpx; height: 820px; margin: 0 auto; position: fixed; left: -9999px"></canvas>
      <image :src="pzImg" style="width: 710rpx; height: 820px; margin: 0 auto; display: block"></image>
    </view>
    <tn-tips ref="tips" position="center"></tn-tips>
    <!-- 悬浮按钮-->
    <view class="tn-flex tn-footerfixed tn-padding" :style="{ paddingBottom: vuex_is_black_stripe ? 'calc(20px + 20rpx)' : '', zIndex: 999999 }">
      <view class="tn-flex-1 justify-content-item tn-text-center c-38">
        <tn-button class="tn-button c-39" shape="round" backgroundColor="#0059FF" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="onSubmit">
          <text class="">下载凭证</text>
        </tn-button>
      </view>
    </view>
    <tn-tips ref="tips" position="center" z-index="999999"></tn-tips>
    <tn-toast ref="toast" z-index="999999"></tn-toast>
  </view>
</template>

<script>
import template_page_mixin from '@/libs/mixin/template_page_mixin.js'
import customerNotice from '@/components/customerNotice'
import { timestampToTimes } from '@/util/util.js'
export default {
  name: 'TemplatePending',
  mixins: [template_page_mixin],
  components: {
    customerNotice,
  },
  data() {
    return {
      content: '',
      // 演示地址，请勿直接使用
      action: '',
      fileList: [],

      orderId: '',
      itemId: '',
      detail: '',
      pzImg: '',
      timestampToTimes,
    }
  },
  onLoad(options) {
    console.log('options')
    console.log('options', options)
    if (options.orderId) {
      this.orderId = options.orderId
      this.getDetail()
    }
    if (options.itemId) {
      this.itemId = options.itemId
    }
  },
  onShow() {
    // setTimeout(()=>{
    // 	this.showCountDown = true
    // })
    // console.log('vuex_is_black_stripe',this.vuex_is_black_stripe)

    // 同步获取
    const systemInfo = uni.getSystemInfoSync()
    const dpr = systemInfo.pixelRatio // 设备像素比（DPR）

    console.log('设备的缩放比', dpr)
    this.action = this.$http.commoneUrl + 'app-api/infra/file/upload'
  },
  methods: {
    getDetail() {
      this.$http
        .getRequest('app-api/trade/order/get-detail', {
          id: this.orderId,
        })
        .then(res => {
          if (res.code == 0) {
            this.detail = res.data
            this.detail.item = this.detail.items.filter(item => item.id == this.itemId)
            this.detail.qualityTime = parseInt(this.detail.checkTime) + parseInt(this.detail.item[0].shelfLifeDays) * 3600 * 24 * 1000
            console.log(this.detail)
            console.log(this.detail.checkTime)
            console.log(this.detail.item)
            console.log(this.detail.item.shelfLifeDays)
            console.log(this.detail.qualityTime)
            setTimeout(() => {}, 500)
            setTimeout(() => {
              this.generateAfterSaleCertificat()
            }, 500)
          } else {
            this.$refs.tips.show({
              msg: res.msg,
              backgroundColor: '#E83A30',
              fontColor: '#FFFFFF',
              duration: 1500,
            })
          }
        })
    },

    generateAfterSaleCertificat() {
      const ctx = uni.createCanvasContext('afterSaleCanvas')
      const ctxValue = ctx
      // 清除之前的绘制内容（可选）
      ctxValue.clearRect(0, 0, 300, 820)
      // ctxValue.drawImage('../../../static/pz_bg.png', 0, 0, 300, 510);
      let canvasWidth = 0
      uni
        .createSelectorQuery()
        .select('#afterSaleCanvas')
        .boundingClientRect(res => {
          console.log('res', res)
          canvasWidth = res.width
          ctxValue.drawImage('../../../static/pz_bg.png', 0, 0, canvasWidth, 820)
          ctxValue.drawImage('../../../static/logo1.png', 35, 55, 104, 32)
          // 设置文字样式
          // 假设文本和样式
          const text = '简一质保凭证'
          ctxValue.font = 'normal bold 18px Arial'
          ctxValue.setFillStyle('black')
          const textWidth = ctxValue.measureText('简一质保凭证').width // 这是一个非常粗略的估算！
          // 计算文本的起始x坐标以使其居中
          const x = (canvasWidth - textWidth) / 2 // Canvas宽度为300px
          // 绘制文本
          ctxValue.fillText(text, x, 130)
          ctxValue.font = 'normal 14px Arial'
          // ctxValue.setFontSize(textStyle1);
          ctxValue.setFillStyle('black')
          let endDate = this.timestampToTimes(this.detail.qualityTime)
          endDate = endDate.split('-')
          endDate = endDate[0] * 1 + 2 + '-' + endDate[1] + '-' + endDate[2]
          // 绘制售后信息
          ctxValue.fillText('订单号', 30, 180)
          ctxValue.fillText(this.detail.no + '', 130, 180)
          ctxValue.fillText('质保截止日期', 30, 215)
          ctxValue.fillText(endDate + '', 130, 215)
          ctxValue.fillText('施工的场景', 30, 250)
          ctxValue.fillText(this.detail.orderTag == '0' ? '包工包料' : '仅施工', 130, 250)
          ctxValue.fillText('膜材', 30, 285)
          ctxValue.fillText(this.detail.items[0].spuName, 130, 285)
          ctxValue.fillText('数量', 30, 320)
          ctxValue.fillText(this.detail.items[0].count / 10000 + (this.detail.items[0].spuName.indexOf('灶台') > -1 ? 'm' : 'm²'), 130, 320)
          ctxValue.fillText('师傅姓名', 30, 355)
          ctxValue.fillText(this.detail.receiverName, 130, 355)
          ctxValue.fillText('质保内容', 30, 390)
          ctxValue.fillText('质保周期内出现明显的气泡、翘', 130, 390)
          ctxValue.fillText('边现象，进行上门售后维护', 130, 425)
          ctxValue.font = 'normal bold 14px Arial'
          ctxValue.fillText('售后告知：', 30, 450)
          ctxValue.font = 'normal 14px Arial'
          ctxValue.fillText('以下视为客户人为原因所致，不予质保售后：', 30, 485)
          ctxValue.fillText('1、膜是易耗品，损伤变旧是正常的，不用过于', 30, 520)
          ctxValue.fillText('担忧，主要是为了保护家具的', 30, 555)
          ctxValue.fillText('2、一般24小时候以后才可以使用', 30, 590)
          ctxValue.fillText('3、不能使用高温物体直接放置（如砂锅、油锅）', 30, 625)
          ctxValue.fillText('4、不能用尖锐物体划伤（如刀尖）', 30, 660)
          ctxValue.fillText('以此为凭，享受售后质保权益！ ', 80, 695)
          ctxValue.fillText('湖北简一家居科技有限公司', 150, 745)
          ctxValue.drawImage('../../../static/gz_img.png', 200, 670, 126.64, 126.64)
          // 绘制其他图形或二维码（如果需要）
          // ...
          // 绘制完成后导出图片
          ctxValue.draw(true, () => {
            uni.canvasToTempFilePath({
              canvasId: 'afterSaleCanvas',
              success: res => {
                console.log('图片路径:', res.tempFilePath)
                // 可以在这里使用图片路径，如预览、上传等
                this.pzImg = res.tempFilePath
              },
              fail: err => {
                console.error('导出图片失败:', err)
              },
            })
          })
        })
        .exec()
    },

    onSubmit() {
      uni.canvasToTempFilePath({
        canvasId: 'afterSaleCanvas',
        success: res => {
          console.log('临时图片路径:', res.tempFilePath)
          uni.saveImageToPhotosAlbum({
            filePath: this.pzImg,
            success: () => {
              this.$refs.toast.show({
                title: '保存成功',
                icon: 'success',
                image: '',
                duration: 1000,
              })
            },
            fail: err => {
              console.error('保存图片失败:', err)
              this.$refs.tips.show({
                msg: '保存失败',
                backgroundColor: '#E83A30',
                fontColor: '#FFFFFF',
                duration: 1500,
              })
            },
          })
        },
        fail: err => {
          console.error('canvas转图片失败:', err)
          this.$refs.tips.show({
            msg: '生成图片失败',
            backgroundColor: '#E83A30',
            fontColor: '#FFFFFF',
            duration: 1500,
          })
        },
      })
    },

    // 跳转
    tn(e) {
      uni.navigateTo({
        url: e,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/* 底部悬浮按钮 start*/
.tn-tabbar-height {
  min-height: 160rpx;
  height: calc(180rpx + env(safe-area-inset-bottom) / 2);
  height: calc(180rpx + constant(safe-area-inset-bottom));
}

.tn-footerfixed {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 1024;
  box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.2);
  background-color: white;
  gap: 20rpx;
  padding: 20rpx 30rpx;
}

::v-deep  .tn-button button {
  background: linear-gradient(130.69deg, #0059ff 0%, #004ad4 100%);
  // box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
}
::v-deep  .c1-39.tn-button button {
  background: white;
  // box-shadow: 0rpx 4rpx 10rpx  #002D80,inset 6rpx 4rpx 10rpx  #002D80;
}
::v-deep  .tn-icon-close-fill {
  font-size: 40rpx !important;
  color: $tn-font-title-color !important;
}
/* 底部悬浮按钮 end*/
::v-deep  .time-line-item__content__time {
  color: #a29e9e;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.e-1 {
  padding: 20rpx 30rpx;
}
.e-2 {
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: $tn-bg1-color;
}
.e-3 ::v-deep  .tn-image-upload__item {
  background-color: transparent !important;
  border-radius: 16rpx;
  border: 1rpx dashed #7a8499;
}
.e-4 {
  margin-top: 10rpx;
  font-weight: bold;
  color: $tn-font-title-color;
  margin-bottom: 20rpx;
  font-size: 30rpx;
}
.e-5 {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}
.e-6 {
  margin-right: 30rpx;
}
.c-2 {
  padding: 0 30rpx;
  background-color: white;
  border-radius: 8rpx;
  margin-top: 20rpx;
}
.c-15 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.c-2 .c-15:last-child {
  margin-bottom: 0;
}
.c-16 {
  width: 176rpx;
  height: 176rpx;
  border-radius: 8rpx;
}
.c-17 {
  width: 490rpx;
  position: relative;
}
.c-18 {
  color: $tn-font-title-color;
  font-size: 30rpx;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.c-19-box {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}
.c-19 {
  font-size: 24rpx;
  color: $tn-font-sub1-color;
}
.c-19-box .c-19:last-child text {
  display: none;
}
.c-20 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.c-21 {
  color: $tn-theme-color;
}
.c-38 {
  width: 100%;
  gap: 20rpx;
  display: flex;
}
.c-39 {
  flex: 1;
}
</style>
