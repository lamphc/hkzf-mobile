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

// 选中数据维护
const selectedValues = {
  area: ['area', 'null'],
  // area: ['area', 'AREA|69cc5f6d-4f29-a77c', 'AREA|73aa1890-64c7-51d9'],
  mode: ['null'],
  // mode: ['true'],
  price: ['null'],
  // price: ['PRICE|1000'],
  more: []
}
export default class Filter extends Component {
  // 标题高亮状态
  state = {
    titleSelectedStatus: { ...titleSelectedStatus },
    // 打开当前type状态
    openType: ''
  }

  componentDidMount() {
    // 存储到实例属性上
    this.selectedValues = { ...selectedValues };
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
      titleSelectedStatus: { ...titleSelectedStatus, [type]: true },
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
    let newSel = this.handlerSel();
    this.setState({
      openType: '',
      titleSelectedStatus: newSel
    })
  }

  // 处理筛选器选中后有无条件的高亮状态
  handlerSel = () => {
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(this.selectedValues).forEach((key) => {
      let cur = this.selectedValues[key];
      if (
        (key === 'area') && (cur[1] !==
          "null" || cur[0] === 'subway')) {
        newTitleSelectedStatus['area'] = true
      } else if (key === 'mode' && cur[0] !== "null") {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && cur[0] !== "null") {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && cur.length !== 0) {
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    return newTitleSelectedStatus
  }

  // 确定选择过滤条件
  onOk = (sel) => {
    const { openType } = this.state;
    console.log('sel:', openType, sel);
    // 存储到实例属性上
    this.selectedValues[openType] = sel;
    let newSel = this.handlerSel();
    console.log('s', newSel);
    this.setState({
      openType: '',
      titleSelectedStatus: newSel
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
      return <FilterPicker key={openType} data={data} value={this.selectedValues[openType]} cols={cols} onCancel={this.onCancel} onOk={this.onOk} />

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
