import React from 'react'

import { Flex, Toast } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'
import { getHouseByFilters } from '../../utils/api/house'
import { getCurrCity } from '../../utils'

import { List, AutoSizer, InfiniteLoader } from 'react-virtualized';
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/axios'
import NoHouse from '../../components/NoHouse'

export default class HouseList extends React.Component {

  state = {
    // 房屋列表数据
    list: [],
    count: 0
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCurrCity();
    this.cityId = value;
    this.getHouseList()
  }


  onFilter = async (filters) => {
    console.log('找房列表获取filter数据：', filters);
    this.filters = filters;
    this.getHouseList()
  }


  // 加载房屋列表数据
  getHouseList = async () => {
    // 加载提示
    // 第二个参数为0，不自动关闭
    Toast.loading('加载中...', 0)
    let res = await getHouseByFilters(this.cityId, this.filters, 1, 20);
    console.log(res);
    // 调用hide关闭
    Toast.hide();
    const { list, count } = res.data;
    if (count !== 0) {
      Toast.success(`获取到${count}条房源信息`)
    }
    this.setState({
      list,
      count
    })
  }

  // 渲染列表项
  renderHouseItem = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { list } = this.state
    const item = list[index]
    // 处理暂时没有加载到数据情况
    if (!item) {
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    };
    // console.log(this.props.history)
    // 处理图片地址
    item.src = BASE_URL + item.houseImg;
    // console.log(item);
    return <HouseItem {...item} key={key} onClick={() => { this.props.history.push({ pathname: `/detail/${item.houseCode}` }, { id: item.houseCode }) }} style={style} />
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    // console.log('rowloaded:', index);
    const { list } = this.state;
    return !!list[index];
  }

  // 下拉加载更多时触发：加载下一页数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log('loadmore', startIndex, stopIndex);
    // 调用封装的api(返回一个Promise对象)
    return getHouseByFilters(this.cityId, this.filters, startIndex, stopIndex).then((res) => {
      console.log('loadmore:', res);
      // 刷新视图
      this.setState({
        list: [...this.state.list, ...res.data.list]
      }, () => console.log(this.state.list.length))
    });
  }

  // 没有数据时显示
  renderNoHouse = () => {
    return <NoHouse>没有更多房源,请换个搜索条件吧</NoHouse>
  }
  // 渲染列表
  renderHouseList = () => {
    const { count } = this.state;
    // 没有数据渲染NoHouse组件
    return count === 0 ? this.renderNoHouse() : (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        // 远程数据总条数
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className={styles.houseList}
                height={height}
                rowCount={this.state.count}
                rowHeight={130}
                rowRenderer={this.renderHouseItem}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}
