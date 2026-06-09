import App from './App'
import store from './store'

import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// 引入全局TuniaoUI
import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)

// 引入TuniaoUI提供的vuex简写方法
let vuexStore = require('@/store/$t.mixin.js')
Vue.mixin(vuexStore)

// 引入TuniaoUI对小程序分享的mixin封装
let mpShare = require('tuniao-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)

import share from './util/share.js' //注意路径是上一步新建文件的路径
Vue.mixin(share)

const Big = require('big.js')
Vue.prototype.$Big = Big

import base from './util/tool.js'
Vue.prototype.$base = base

import * as custom from './util/util'
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})
// 请求方法
import http from './util/request/index.js'
Vue.prototype.$http = http
const app = new Vue({
  store,
  ...App,
})

app.$mount()
