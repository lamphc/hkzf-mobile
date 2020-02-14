import React, { Component, lazy } from 'react';

import { Route, Link } from 'react-router-dom';

import { TabBar } from 'antd-mobile';
import tabBars from '../../utils/tabbar_config';

import './index.scss'

import Index from '../Index';
// import House from '../House';
// import Profile from '../Profile';
// const Index = lazy(() => import('../Index'));
const House = lazy(() => import('../House'));
const Profile = lazy(() => import('../Profile'));
/**
 * 首页
 * 1. 默认首页
 * 2. 找房
 * 3. 我的（个人中心）
 */




class Home extends Component {

  state = {
    selectedTab: this.props.location.pathname,
  };


  renderTabBarItems = () => {
    return tabBars.map((item, index) => <TabBar.Item
      title={item.title}
      key={index}
      icon={
        <i className={'iconfont ' + item.icon} />
      }
      selectedIcon={<i className={'iconfont ' + item.icon} />
      }
      selected={this.state.selectedTab === item.path}
      onPress={() => {
        this.setState({
          selectedTab: item.path,
        }, () => {
          this.props.history.push(item.path)
        });
      }}

    />)
  }



  render() {
    // console.log(this.props);
    return (
      <div className="home">
        {/* <Link to="/home/index">首页</Link>
        <Link to="/home/house">找房</Link>
       <Link to="/home/profile">我的</Link> */}
        {/* 首页下二级路由 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/profile" component={Profile} />
        <div className="barBox">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            tabBarPosition="bottom"
            noRenderContent={true}
          >
            {
              this.renderTabBarItems()
            }
          </TabBar>
        </div >
      </div>
    );
  }
}

export default Home;