/**
 * 找房
 */
import axios from '../axios';

// 获取当前城市信息
export const getHouseFilters = (id = 'AREA|88cff55c-aaa4-e2e0') => {
  return axios.get(`/houses/condition?id=${id}`)
}