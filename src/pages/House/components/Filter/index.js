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
    // 获取body元素
    this.bodyDOM = window.document.body;
    this.getFilterData()
  }


  // 获取筛选条件数据
  getFilterData = async () => {
    const { value } = await getCurrCity();
    // 保存城市ID
    this.cityId = value;
    let res = await getHouseFilters(value);
    console.log(res);
    res.status === 200 && (this.filterData = res.data)

  }

  // 传递给子组件控制状态的方法
  onTitleClick = (type) => {
    this.bodyDOM.className = 'scrollAuto';
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
    // 处理高亮
    let newSel = this.handlerSel();
    this.setState({
      openType: '',
      titleSelectedStatus: newSel
    }, () => {
      this.bodyDOM.className = ''
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
        // 更多选择项 FilterMore 组件情况
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    return newTitleSelectedStatus
  }

  // 处理后台需要的筛选条件数据
  handlerFilters = (selectedValues) => {
    // 筛选条件数据
    const { area, mode, price, more } = selectedValues;
    // 组装数据
    const filters = {};
    // area | subway
    let areaKey = area[0], aval;
    if (area.length === 2) {
      aval = area[1]
    } else {
      if (area[2] !== 'null') {
        aval = area[2]
      } else {
        aval = area[1]
      }
    }
    filters[areaKey] = aval;
    // mode
    filters.mode = mode[0]
    // price
    filters.price = price[0]
    // more
    filters.more = more.join(',')
    console.log('filters:', filters);
    return filters
  }

  // 确定选择过滤条件
  onOk = (sel) => {
    this.bodyDOM.className = ''
    const { openType } = this.state;
    console.log('sel:', openType, sel);
    // 存储到实例属性上
    this.selectedValues[openType] = sel;
    // 当前选中的所有筛选条件数据
    console.log('all-sels:', this.selectedValues)
    // 处理高亮
    let newSel = this.handlerSel();
    console.log('s', newSel);
    this.setState({
      openType: '',
      titleSelectedStatus: newSel
    }, () => {
      // 处理筛选条件数据
      this.props.onFilter(this.handlerFilters(this.selectedValues))
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
      console.log('n-sel:', this.selectedValues[openType])
      return <FilterPicker key={openType} data={data} value={this.selectedValues[openType]} cols={cols} onCancel={this.onCancel} onOk={this.onOk} />

    }
  }
  // 渲染和处理FilterMore组件
  renderFilterMore = () => {
    const {
      openType
    } = this.state;
    if (openType === 'more') {
      console.log(this.filterData);
      const { roomType, oriented, floor, characteristic } = this.filterData;
      const data = { roomType, oriented, floor, characteristic }
      console.log('n-sel:', this.selectedValues[openType]);
      return <FilterMore data={data} value={this.selectedValues[openType]} type={openType} onOk={this.onOk} onCancel={this.onCancel} />
    }
    return null
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
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}
