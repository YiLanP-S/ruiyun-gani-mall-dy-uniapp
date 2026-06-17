import { getScrmBaseUrl } from '../config/scrm.js'

const toRequestUrl = () => `${getScrmBaseUrl().replace(/\/+$/, '')}/`

const resolveRequestUrl = (url, queryParams) => {
  const requestPath = (url || '').replace(/^\/+/, '')
  return `${toRequestUrl()}${requestPath}${formatQuery(queryParams)}`
}

const formatQuery = (queryParams = {}) => {
  if (!queryParams || Object.keys(queryParams).length === 0) return ''
  const queryString = Object.keys(queryParams)
    .filter((key) => queryParams[key] !== undefined && queryParams[key] !== null)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&')
  return queryString ? `?${queryString}` : ''
}
const token = () => uni.getStorageSync('token')

const buildAuthHeader = (customHeader = {}) => {
  const header = {
    'content-type': 'application/json',
    Authorization: token()
  }
  Object.assign(header, customHeader)
  return header
}

const request = (method, url, data, queryParams, headerData) => {
  const requestUrl = resolveRequestUrl(url, queryParams)
  const header = buildAuthHeader(headerData ? { 'content-type': headerData['content-type'] } : {})

  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      data,
      header,
      success: function (res) {
        if (res.data && res.data.code === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userId')
          uni.removeStorageSync('isDistributo')
          console.log('清除缓存删除成功')
        }

        if (res.statusCode === 200 && res.data && Object.prototype.hasOwnProperty.call(res.data, 'code')) {
          resolve(res.data)
        } else if (res.statusCode === 200) {
          resolve({
            code: res.data && res.data.code !== undefined && res.data.code !== null ? res.data.code : -1,
            data: res.data,
            msg: '接口返回缺失 code 字段'
          })
        } else {
          reject('网络出错')
        }
      },
      fail: function () {
        reject('网络出错')
      }
    })
  })
}

function postRequest(url, data, headerData) {
  return request('POST', url, data, {}, headerData)
}

function getRequest(url, queryParams = {}) {
  return request('GET', url, undefined, queryParams, {})
}

function putRequest(url, queryParams = {}, data) {
  return request('PUT', url, data, queryParams, {})
}

function putNewRequest(url, data) {
  return request('PUT', url, data, {}, {})
}

function deleteRequest(url, queryParams = {}) {
  return request('DELETE', url, undefined, queryParams, {})
}

const http = {
  getRequest,
  postRequest,
  putRequest,
  putNewRequest,
  deleteRequest,
  get commoneUrl() {
    return toRequestUrl()
  }
}

export default http
module.exports = http
