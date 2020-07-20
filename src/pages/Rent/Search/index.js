import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCurrCity } from '../../../utils'

import styles from './index.module.css'
import { getCommunity } from '../../../utils/api/city'

export default class Search extends Component {

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  async componentDidMount () {
    // 获取城市ID
    const { value } = await getCurrCity()
    this.cityId = value
  }

  // 搜索小区
  handlerSearch = (v) => {
    v = v.trim()
    if (v.length === 0) {
      return this.setState({
        searchTxt: '',
        tipsList: []
      })
    }
    this.setState({
      searchTxt: v
    }, () => {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 获取小区列表
        const res = await getCommunity(v, this.cityId)
        if (res.status === 200) {
          this.setState({
            tipsList: res.data
          })
        }
      }, 600)
    })

  }

  // 选择小区回传
  selectCom = (item) => {
    this.props.history.replace({ pathname: '/rent/add', state: { id: item.community, name: item.communityName } })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li onClick={() => this.selectCom(item)} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  render () {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handlerSearch}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
