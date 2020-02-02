import React, { Component } from 'react';
import { getCities } from '../../utils/api/city';

class CityList extends Component {


  componentDidMount() {
    this.getCities()
  }

  // 格式化城市列表数据
  formatCities = (data) => {
    let cityList = {}, cityIndex;
    data.forEach((item) => {
      let first = item.short.slice(0, 1);
      // 判断对象中是否存在某个属性
      if (!(first in cityList)) {
        cityList[first] = [item]
      } else {
        cityList[first].push(item)
      }
    })
    cityIndex = Object.keys(cityList).sort()
    return {
      cityIndex,
      cityList
    }
  }

  // 获取城市列表数据
  getCities = async () => {
    let res = await getCities();
    if (res.status === 200) {
      console.log('cities:', res.data);
      const {
        cityIndex,
        cityList
      } = this.formatCities(res.data)
      console.log('formated:', cityList, cityIndex);
    }
  }

  render() {
    return (
      <div>
        CityList
      </div>
    );
  }
}

export default CityList;