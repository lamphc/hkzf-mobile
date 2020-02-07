/**
 * 用户
 */
import axios from '../axios';

// 登录
export const login = (data) => {
  return axios.post('/user/login', data)
}

// 获取登录用户信息
export const getUserInfo = (token) => {
  return axios.get('/user', {
    headers: {
      authorization: token
    }
  })
}

// 退出登录
export const logout = (token) => {
  return axios.post('/user/logout', null, {
    headers: {
      authorization: token
    }
  })
}