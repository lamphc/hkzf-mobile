import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { getHouseFilters } from '../../../../utils/api/house'
import { getCurrCity } from '../../../../utils'

// 标题高亮状态
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
export default class Filter extends Component {
  // 标题高亮状态
  state = {
    titleSelectedStatus,
    // 打开当前type状态
    openType: ''
  }

  componentDidMount() {
    this.getFilterData()
  }


  // 获取筛选条件数据
  getFilterData = async () => {
    const { value } = await getCurrCity();
    let res = await getHouseFilters(value);
    console.log(res);
    res.status === 200 && (this.filterData = res.data)

  }

  // 传递给子组件控制状态的方法
  onTitleClick = (type) => {
    this.setState({
      titleSelectedStatus: { ...this.state.titleSelectedStatus, [type]: true },
      openType: type
    })
  }

  // 控制前三个过滤器内容和遮罩层显隐
  isShow = () => {
    const { openType } = this.state
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 关闭前三个过滤器内容和遮罩层
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 确定选择过滤条件
  onOk = () => {
    this.setState({
      openType: ''
    })
  }

  // 给Picker组件提供数据
  renderFilterPicker = () => {
    if (this.isShow()) {
      const { openType } = this.state;
      const { area, subway, rentType, price } = this.filterData;
      let data, cols = 1;
      switch (openType) {
        case 'area':
          data = [area, subway];
          cols = 3
          break;
        case 'mode':
          data = rentType;
          cols = 1
          break;
        case 'price':
          data = price;
          cols = 1
          break;
      }
      return <FilterPicker data={data} cols={cols} onCancel={this.onCancel} onOk={this.onOk} />
    }

  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.isShow() ? <div onClick={this.onCancel} className={styles.mask} /> : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={this.state.titleSelectedStatus} onTitleClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
