import http from '@/util/request/index.js'

export const addPartnerAPI = data => {
  return http.postRequest('app-api/member/shop-business/create', data)
}
