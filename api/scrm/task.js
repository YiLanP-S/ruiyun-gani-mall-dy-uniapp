import { get, post } from './http'

export const fetchTaskPage = (params = {}) => {
  return get('app-api/task/page', params)
}

export const fetchTaskDetail = (id) => {
  return get('app-api/task/get', { id })
}

export const createTask = (payload = {}) => {
  return post('app-api/task/create', payload)
}
