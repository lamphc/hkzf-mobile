import React, { Component } from 'react';
import { NavBar, Icon, Toast } from 'antd-mobile';

import styles from './index.module.css'
import { getCurrCity } from '../../utils';
import { getMapHouses } from '../../utils/api/city';
import { getHouseByFilters } from '../../utils/api/house';
import HouseItem from '../../components/HouseItem';
import { BASE_URL } from '../../utils/axios';

class Map extends Component {

  state = {
    list: [],
    isShowList: false
  }

  componentDidMount() {
    this.initMap()
  }

  // 提供地图缩放级别和覆盖物类型
  getTypeAndZoom = () => {
    let type, nextLevel
    // 获取小区缩放级别

    const currZoom = this.map.getZoom() // 项目中默认缩放级别为：11
    if (currZoom >= 10 && currZoom < 12) {
      // 区
      type = 'circle'
      nextLevel = 13
    } else if (currZoom >= 12 && currZoom < 14) {
      // 镇
      type = 'circle'
      nextLevel = 15
    } else if (currZoom >= 14 && currZoom < 16) {
      // 小区
      type = 'rect'
    }
    return {
      type,
      nextLevel
    }
  }


  // 创建覆盖物
  createOverlays = (type, item, nextLevel) => {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value
    } = item;
    // 转换地理位置坐标
    const ipoint = new this.BMap.Point(longitude, latitude);
    if (type === 'rect') {
      this.createRect(ipoint, areaName, count, value)
    } else {
      this.createCircle(ipoint, areaName, count, value, nextLevel)
    }
  }

  // 处理小区情况
  createRect = (ipoint, areaName, count, value) => {
    // 绘制覆盖物
    const opts = {
      position: ipoint,    // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(-50, -28)    //设置文本偏移量
    }
    const label = new this.BMap.Label(null, opts);  // 创建文本标注对象
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${areaName}</span>
        <span class="${styles.housenum}">${count}</span>
        <i class="${styles.arrow}"></i>
      </div>
     `
    )
    // 去除默认样式
    label.setStyle({
      border: 'none'
    });
    // 添加点击事件
    label.addEventListener('click', (e) => {
      console.log('点击小区', value);
      // this.map.centerAndZoom(ipoint, 15)
      // this.map.panTo(ipoint)
      console.log(e);
      this.moveToArea(e);
      this.handlerHouseList(value)
    })
    this.map.addOverlay(label);
  }

  // 移动地图到当前小区位置
  moveToArea = (e) => {
    let { clientX, clientY } = e.changedTouches[0];
    console.log(window.innerWidth / 2, (window.innerHeight - 330) / 2, clientX, clientY)
    const x = window.innerWidth / 2 - clientX, y = (window.innerHeight - 330) / 2 - clientY;
    console.log(x, y)
    this.map.panBy(x, y)
  }

  // 获取小区下的房源列表
  // 调用之前定义的根据过滤条件获取房源列表方法，传入cityId
  handlerHouseList = async (value) => {
    const { status, data: { list } } = await getHouseByFilters(value);
    status === 200 && this.setState({
      list,
      isShowList: true
    })
  }

  // 处理区和镇的情况
  createCircle = (ipoint, areaName, count, value, nextLevel) => {
    // 绘制覆盖物
    const opts = {
      position: ipoint,    // 指定文本标注所在的地理位置
      offset: new this.BMap.Size(0, 0)    //设置文本偏移量
    }
    const label = new this.BMap.Label(null, opts);  // 创建文本标注对象
    // 给label添加唯一ID
    // label.id = value;
    label.setContent(
      `
              <div class="${styles.bubble}">
              <p class="${styles.bubbleName}">${areaName}</p>
              <p>${count}</p>
              </div>
              `
    )
    // 去除默认样式
    label.setStyle({
      border: 'none'
    });
    // 添加点击事件
    label.addEventListener('click', () => {
      // 设置显示下一区域的位置和缩放级别
      this.map.centerAndZoom(ipoint, nextLevel);
      this.renderOverlays(value);
      // 清除第一层覆盖物
      // map.clearOverlays();
      setTimeout(() => this.map.clearOverlays());
    })
    this.map.addOverlay(label);
  }


  // 根据区域渲染覆盖物
  renderOverlays = async (id) => {
    // Toast.loading('加载中...', 0);
    // 初始化区覆盖物
    let { status, data } = await getMapHouses(id);
    // Toast.hide();
    // =========获取覆盖物类型和下一层缩放级别========
    const { type, nextLevel } = this.getTypeAndZoom();
    if (status === 200) {
      data.forEach((item) => {
        this.createOverlays(type, item, nextLevel)
      })
    }
  }

  // 初始化地图
  initMap = async () => {
    // 挂载到实例上
    this.BMap = window.BMap;
    // 创建地图实例 
    this.map = new this.BMap.Map("container");
    // 获取定位城市
    const { value, label } = await getCurrCity();
    // 创建地址解析器实例     
    let myGeo = new this.BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(null, async (point) => {
      if (point) {
        // 初始化地图，设置中心点坐标和地图级别  
        this.map.centerAndZoom(point, 11);
        // 添加控件
        this.map.addControl(new this.BMap.NavigationControl());
        this.map.addControl(new this.BMap.ScaleControl());
        // map.addOverlay(new BMap.Marker(point));
        this.renderOverlays(value)
      }
    },
      label);
    this.map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : ''
        ].join(' ')}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/home/house">
            更多房源
    </a>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {
            this.state.list.map(item => (
              <HouseItem
                onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
              />
            ))
          }
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className={styles.map}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          地图
</NavBar>
        <div id="container"></div>
        {/* 房源列表 */}
        {
          this.renderHouseList()
        }
      </div>
    );
  }
}

export default Map;