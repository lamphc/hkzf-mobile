import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';

import { BASEURL } from '../../utils/axios';
import { getSwiper } from '../../utils/api/home';

import './index.scss';

// 导入图片
import Nav1 from '../../assets/images/nav-1.png';
import Nav2 from '../../assets/images/nav-2.png';
import Nav3 from '../../assets/images/nav-3.png';
import Nav4 from '../../assets/images/nav-4.png';


import { Flex } from 'antd-mobile';

// 首页菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

class Index extends Component {
  state = {
    data: [],
    imgHeight: 234,
    aplay: false
  }
  componentDidMount() {
    this.getSwiper()
  }

  getSwiper = async () => {
    let res = await getSwiper();
    this.setState({
      data: res.data.body,
    }, () => {
      this.setState({
        aplay: true
      })
    })
  }

  renderNavs = () => {
    return navs.map((item) => <Flex.Item onClick={() => this.props.history.push(item.path)} key={item.id}>
      <img src={item.img} />
      <p>{item.title}</p>
    </Flex.Item>)
  }

  // 渲染轮播图
  renderCarousel = () => {
    console.log('d', this.state.data);
    return this.state.data.map(val => (
      <a
        key={val.id}
        href="http://www.itheima.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight, background: 'gray' }}
      >
        <img
          src={`${BASEURL}${val.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }

  render() {
    return (
      <div>
        {/* 轮播 */}
        <Carousel
          autoplay={this.state.aplay}
          infinite
        >
          {this.renderCarousel()}
        </Carousel>
        {/* 菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>
        {/* 租房小组 */}
        <div className="group">
          {/* 标题 */}
          <Flex className="group-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
        </div>
      </div>
    );
  }
}

export default Index;