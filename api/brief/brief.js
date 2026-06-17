import { post } from '@/api/scrm/http.js'

export const addPartnerAPI = (data) => {
  return post('app-api/member/shop-business/create', data)
}
