import React from 'react'

import { Flex } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getHouseByFilters } from '../../utils/api/house'
import { getCurrCity } from '../../utils'

export default class HouseList extends React.Component {

  state = {
    start: 1,
    end: 20
  }

  componentDidMount() {
    this.getHouseList()
  }


  onFilter = async (filters) => {
    console.log('找房列表获取filter数据：', filters);
    this.filters = filters;
    this.getHouseList(this.cityId, this.filters, 1, 20)
  }

  getHouseList = async () => {
    const { value } = await getCurrCity();
    this.cityId = value;
    let res = await getHouseByFilters(value, this.filters, 1, 20);
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
      </div>
    )
  }
}
