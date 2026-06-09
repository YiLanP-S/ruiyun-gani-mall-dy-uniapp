const Big = require('big.js')

const base = {
  //分转元保留两位小数
  f2y(s, n) {
    if (s > 0) {
      if (n === 0) {
        return Big(s).div(100, 2)
      } else {
        return Big(s)
          .div(100, 2)
          .toFixed(n || 2)
      }
    }
    return 0
  },

  //分转元截取整数部分
  f2yFront(s) {
    if (s > 0) {
      // let num = console.log('==========', num)
      return Big(s).div(100, 2).toFixed(2).toString().slice(0, -2)
    }
  },

  //分转元截取小数部分
  f2yBack(s) {
    if (s > 0) {
      // let num = console.log('==========', num)
      return Big(s).div(100, 2).toFixed(2).toString().slice(-2)
    }
  },
}

export default base
