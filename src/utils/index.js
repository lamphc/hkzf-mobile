/**
 * 工具库
 */
import { getCityInfo } from "./api/city";


// 数据持久化
// 当前城市KEY
export const CURR_CITY = 'hkzf_city', TOKEN = 'hkzf_token';

export const getLocalData = (key) => {
  return window.localStorage.getItem(key)
}
export const setLocalData = (key, val) => {
  window.localStorage.setItem(key, val)
}
export const removeLocalData = (key) => {
  window.localStorage.removeItem(key)
}

// token处理

const getToken = () => getLocalData(TOKEN)

const setToken = val => setLocalData(TOKEN, val)

const removeToken = () => removeLocalData(TOKEN)

const isAuth = () => !!getToken()
export { getToken, setToken, removeToken, isAuth }

// 获取当前城市信息
export const getCurrCity = () => {
  const currentCity = JSON.parse(getLocalData(CURR_CITY));
  if (!currentCity) {
    return new Promise((reslove, reject) => {
      const myCity = new window.BMap.LocalCity();
      myCity.get(async (result) => {
        let res = await getCityInfo(result.name);
        if (res.status === 200) {
          console.log('cc', res.data);
          setLocalData(CURR_CITY, JSON.stringify(res.data))
          reslove(res.data)
        } else {
          reject(res)
        }
      });
    })
  } else {
    console.log('has', currentCity);
    return Promise.resolve(currentCity)
  }
}