import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { getCities, getHotCities } from '../../utils/api/city';
import { getCurrCity } from '../../utils';

import { List, AutoSizer } from 'react-virtualized';

import './index.css'

// List data as an array of strings
const list = new Array(100)

class CityList extends Component {

  state = {
    w: 0,
    h: 0
  }

  componentDidMount() {
    this.getCities();
    this.setState({
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight
    })
  }

  // 渲染列表项
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div className="item" key={key} style={style}>
        {index}
      </div>
    );
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
      // a-z的城市
      const {
        cityIndex,
        cityList
      } = this.formatCities(res.data);
      // 热门城市
      const hot = await getHotCities();
      console.log(hot);
      cityIndex.unshift('hot');
      cityList['hot'] = hot.data;
      // 当前城市
      let cur = await getCurrCity();
      cityIndex.unshift('#');
      cityList['#'] = [cur];
      console.log('formated:', cityList, cityIndex);
    }
  }

  render() {
    return (
      <div className="cityList">
        {/* bar */}
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          城市选择
</NavBar>
        {/* 列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              rowCount={list.length}
              rowHeight={100}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default CityList;