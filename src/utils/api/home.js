/**
 * 首页接口请求
 */
import axios from '../axios';

// 获取轮播图
export const getSwiper = () => {
  return axios.get('/home/swiper')
}