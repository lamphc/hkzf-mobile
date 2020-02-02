import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

import styles from './index.module.css'

class Map extends Component {

  componentDidMount() {
    this.initMap()
  }
  // 初始化地图
  initMap = () => {
    const { BMap } = window;
    var map = new BMap.Map("container");
    // 创建地图实例  
    var point = new BMap.Point(116.404, 39.915);
    // 创建点坐标  
    map.centerAndZoom(point, 15);
    // 初始化地图，设置中心点坐标和地图级别  
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