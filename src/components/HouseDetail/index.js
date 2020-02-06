import React, { Component } from 'react'
import { Carousel, Flex, Modal, Toast, NavBar, Icon } from 'antd-mobile'
// import axios from 'axios'
import HouseItem from '../HouseItem'
import styles from './index.module.css'
import HousePackage from '../HousePackage'
import { getHouseDetail } from '../../utils/api/house'
const BASE_URL = `http://localhost:8080`
// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

const alert = Modal.alert

export default class HouseDetail extends Component {
  state = {
    // 数据加载中状态
    isLoading: false,

    // 房屋详情
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '',
      // 房屋面积
      size: 0,
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    },

    // 表示房源是否收藏
    isFavorite: false
  }

  componentDidMount() {
    // 获取配置好的路由参数：
    // console.log('路由参数对象：', this.props.match.params)
    // console.log(this.props)

    // 获取房屋数据
    this.getHouseDetail()
  }

  /* 
      收藏房源：

      1 给收藏按钮绑定单击事件，创建方法 handleFavorite 作为事件处理程序。
      2 调用 isAuth 方法，判断是否登录。
      3 如果未登录，则使用 Modal.alert 提示用户是否去登录。
      4 如果点击取消，则不做任何操作。
      5 如果点击去登录，就跳转到登录页面，同时传递 state（登录后，再回到房源收藏页面）。
      
      6 根据 isFavorite 判断，当前房源是否收藏。
      7 如果未收藏，就调用添加收藏接口，添加收藏。
      8 如果已收藏，就调用删除收藏接口，去除收藏。

      alert('提示', '登录后才能收藏房源，是否去登录?', [
        { text: '取消' },
        {
          text: '去登录',
          onPress: () => {}
        }
      ])
    */

  // 获取房屋详细信息
  async getHouseDetail() {
    console.log(this.props.history)
    const { id } = this.props.match.params
    console.log('get house id:', id);
    // 开启loading
    this.setState({
      isLoading: true
    })

    // const res = await axios.get(
    //   `http://localhost:8080/houses/5cc47c8d1439630e5b47d45d`
    // )
    const res = await getHouseDetail(id)

    // console.log(res.data.body)

    this.setState({
      houseInfo: res.data,
      isLoading: false
    })

    const { community, coord } = res.data;

    // 渲染地图
    this.renderMap(community, coord)
  }

  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg }
    } = this.state

    return houseImg.map(item => (
      <a key={item} href="http://itcast.cn">
        <img src={BASE_URL + item} alt="" />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
        <span>${community}</span>
        <div class="${styles.mapArrow}"></div>
      `)
    map.addOverlay(label)
  }

  // 渲染标签
  renderTags() {
    const {
      houseInfo: { tags }
    } = this.state

    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }

  render() {
    const {
      isLoading,
      houseInfo: {
        community = '',
        title,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description
      },
      isFavorite
    } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          房屋详情
        </NavBar>
        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
              ''
            )}
        </div>
        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>{this.renderTags()}</Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>
        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {/* <HousePackage list={supporting} /> */}
          {/* <div className="title-empty">暂无数据</div> */}

          {supporting.length === 0 ? (
            <div className={styles.titleEmpty}>暂无数据</div>
          ) : (
              <HousePackage list={supporting} />
            )}
        </div>
        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>
        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>
        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={
                BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')
              }
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>
              {isFavorite ? '已收藏' : '收藏'}
            </span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
