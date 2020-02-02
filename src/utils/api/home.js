/**
 * 首页接口请求
 */
import axios from '../axios';

// 获取轮播图
export const getSwiper = () => {
  return axios.get('/home/swiper')
}

// 获取租房小组
export const getGroup = (area = 'AREA%7C88cff55c-aaa4-e2e0') => {
  return axios.get(`/home/groups?area=${area}`)
}

// 获取新闻
export const getNews = (area = 'AREA|88cff55c-aaa4-e2e0') => {
  return axios.get(`/home/news?area=${area}`)
}