// 存储的键名
const TOKEN_KEY = 'token'
const USER_KEY = 'user_info'

export const auth = {
  // 保存token
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 获取token
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 移除token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // 保存用户信息
  setUserInfo(userInfo) {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = localStorage.getItem(USER_KEY)
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 移除用户信息
  removeUserInfo() {
    localStorage.removeItem(USER_KEY)
  },

  // 清除所有认证信息
  clear() {
    this.removeToken()
    this.removeUserInfo()
  }
} 