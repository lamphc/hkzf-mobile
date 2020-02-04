import React, { Component } from 'react';
import { NavBar, Icon, Toast } from 'antd-mobile';
import { getCities, getHotCities } from '../../utils/api/city';
import { getCurrCity, setLocalData, CURR_CITY } from '../../utils';

import { List, AutoSizer } from 'react-virtualized';

import './index.scss';


class CityList extends Component {

  state = {
    cityIndex: [],
    cityList: {},
    // 当前位置的索引,激活索引样式状态
    activeIndex: 0
  }

  componentDidMount() {
    this.getCities();
    // 获取列表实例
    this.listRef = React.createRef()
  }

  // 动态获取列表行高
  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state;
    const key = cityIndex[index];
    return 36 + 50 * cityList[key].length;
  }

  // 格式化字母
  formatLetter(letter, first) {
    switch (letter) {
      case 'hot':
        return first ? '热' : '热门城市';
      case '#':
        return first ? '当' : '当前城市';
      default:
        return letter.toUpperCase();
    }
  }

  // 切换城市
  changeCity = (city) => {
    const hasData = ['北京', '上海', '广州', '深圳'];
    if (hasData.includes(city.label)) {
      setLocalData(CURR_CITY, JSON.stringify(city));
      this.props.history.goBack()
    } else {
      Toast.info('该城市暂无房源数据！', 2)
    }
  }

  // 渲染列表项
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state;
    const letter = cityIndex[index];
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatLetter(letter)}</div>
        {
          cityList[letter].map((item) => <div onClick={() => this.changeCity(item)} key={item.value} className="name">{item.label}</div>)
        }
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

  // 渲染右侧索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state;
    return cityIndex.map((item, index) => {
      return (
        <li
          key={item}
          className="city-index-item"
          onClick={() => {
            console.log(this.listRef);
            this.listRef.current.scrollToRow(index)
          }}
        >
          <span className={activeIndex === index ? 'index-active' : ''}>
            {this.formatLetter(item, true)}
          </span>
        </li>
      )
    })
  }

  // 滚动列表触发
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      console.log(startIndex);
      this.setState({
        activeIndex: startIndex
      })
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
      this.setState({
        cityIndex,
        cityList
      })
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
              // scrollToIndex={this.state.activeIndex}
              ref={this.listRef}
              scrollToAlignment="start"
              onRowsRendered={this.onRowsRendered}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    );
  }
}

export default CityList;