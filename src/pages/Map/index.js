import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

import styles from './index.module.css'
import { getCurrCity } from '../../utils';

class Map extends Component {

  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  initMap = async () => {
    const { BMap } = window;
    // 创建地图实例 
    let map = new BMap.Map("container");
    // 获取定位城市
    const { value, lable } = await getCurrCity();
    // 创建地址解析器实例     
    let myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(lable, function (point) {
      if (point) {
        // 初始化地图，设置中心点坐标和地图级别  
        map.centerAndZoom(point, 11);
        // 添加控件
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.addOverlay(new BMap.Marker(point));
        const opts = {
          position: point,    // 指定文本标注所在的地理位置
          offset: new BMap.Size(0, 0)    //设置文本偏移量
        }
        const label = new BMap.Label(null, opts);  // 创建文本标注对象
        label.setContent(
          `
          <div class="${styles.bubble}">
          <p class="${styles.bubbleName}">浦东新区</p>
          <p>388套</p>
          </div>
          `
        )
        // 去除默认样式
        label.setStyle({
          border: 'none'
        });
        // 添加点击事件
        label.addEventListener('click', () => {
          console.log('覆盖物被点击了', point)
        })
        map.addOverlay(label);
      }
    },
      lable);
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
      </div>
    );
  }
}

export default Map;