const defaultScrmBaseUrl = 'http://127.0.0.1:48080'
const storageKey = 'scrm_base_url'

const trimSlash = (url = '') => url.replace(/\/+$/, '')

const normalizeUrl = (url = '') => trimSlash(String(url || '').trim())

const isLocalScrmHost = (url = '') => {
  const normalized = normalizeUrl(url).toLowerCase()
  if (!normalized) {
    return false
  }
  return (
    normalized.includes('127.0.0.1') ||
    normalized.includes('localhost') ||
    normalized.includes('0.0.0.0') ||
    /^https?:\/\/192\.168\./.test(normalized) ||
    /^https?:\/\/10\./.test(normalized) ||
    /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
  )
}

const shouldRejectStoredUrl = (url = '') => {
  const normalized = normalizeUrl(url).toLowerCase()
  if (!normalized) {
    return false
  }
  if (!/^https?:\/\//.test(normalized)) {
    return true
  }
  if (isLocalScrmHost(normalized)) {
    return false
  }
  return true
}

export const getScrmBaseUrl = () => {
  let storageUrl = ''
  try {
    storageUrl = uni.getStorageSync(storageKey)
  } catch (e) {
    storageUrl = ''
  }

  if (shouldRejectStoredUrl(storageUrl)) {
    try {
      uni.removeStorageSync(storageKey)
      const fallbackUrl = defaultScrmBaseUrl
      storageUrl = fallbackUrl
    } catch (e) {}
  }

  const raw = normalizeUrl(storageUrl) || defaultScrmBaseUrl
  return trimSlash(raw)
}

export const setScrmBaseUrl = (url) => {
  if (!url) return
  uni.setStorageSync(storageKey, trimSlash(url))
}
