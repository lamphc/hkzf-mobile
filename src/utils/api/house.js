/**
 * 找房
 */
import axios from '../axios';

// 获取当前城市信息
export const getHouseFilters = (id = 'AREA|88cff55c-aaa4-e2e0') => {
  return axios.get(`/houses/condition?id=${id}`)
}

// 根据筛选条件获取房屋列表
export const getHouseByFilters = (cityId, params, start, end) => {
  return axios.get(`/houses`, {
    params: {
      cityId,
      ...params,
      start,
      end
    }
  })
}