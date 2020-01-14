import React, { Component } from 'react';
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import { BASEURL } from '../../utils/axios';
import { getSwiper, getGroup, getNews } from '../../utils/api/home';
import navs from '../../utils/home_navs';

import './index.scss';


class Index extends Component {
  state = {
    swiper: [],
    group: [],
    news: [],
    imgHeight: 234,
    aplay: false
  }
  componentDidMount() {
    this.loadDatas()
  }

  // 获取初始化数据
  loadDatas = async () => {
    const apis = [getSwiper(), getGroup(), getNews()];
    let res = await Promise.all(apis);
    console.log('all datas:', res);
    this.setState({
      swiper: res[0].data,
      group: res[1].data,
      news: res[2].data
    }, () => {
      this.setState({
        aplay: true
      })
    })
  }

  // 渲染菜单
  renderNavs = () => {
    return navs.map((item) => <Flex.Item onClick={() => this.props.history.push(item.path)} key={item.id}>
      <img src={item.img} />
      <p>{item.title}</p>
    </Flex.Item>)
  }

  // 渲染轮播图
  renderCarousel = () => {
    console.log('d', this.state.swiper);
    return this.state.swiper.map(val => (
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

  // 渲染租房小组
  renderGroup = () => {
    return (
      <>
        {/* 标题 */}
        <Flex className="group-title" justify="between">
          <h3>租房小组</h3>
          <span>更多</span>
        </Flex>
        <Grid
          data={this.state.group}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={item => {
            return (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`${BASEURL}${item.imgSrc}`} alt="" />
              </Flex>
            )
          }}
        />
      </>
    )
  }

  // 渲染新闻列表
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`${BASEURL}${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
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
          {this.renderGroup()}
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    );
  }
}

export default Index;