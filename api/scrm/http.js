import request from '@/util/request/index.js'

export const get = (url, params = {}) => {
  return request.getRequest(url, params)
}

export const post = (url, data = {}) => {
  return request.postRequest(url, data)
}

export const put = (url, params = {}, data = {}) => {
  return request.putRequest(url, params, data)
}

export const del = (url, params = {}) => {
  return request.deleteRequest(url, params)
}
