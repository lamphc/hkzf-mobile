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

// 获取房屋详情
export const getHouseDetail = (id) => {
  return axios.get(`/houses/${id}`)
}

// 获取房屋是否收藏过
export const getHouseFav = (id) => {
  return axios.get(`/user/favorites/${id}`)
}

// 添加收藏
export const addFav = (id) => {
  return axios.post(`/user/favorites/${id}`)
}

// 删除收藏
export const delFav = (id) => {
  return axios.delete(`/user/favorites/${id}`)
}
