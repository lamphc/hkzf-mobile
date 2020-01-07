import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';

import { TabBar } from 'antd-mobile';
import tabBars from '../../utils/tabbar_config';

import '../../assets/fonts/iconfont.css'
import './index.css'

import Index from '../Index';
import House from '../House';
import Profile from '../Profile';
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
      <div>
        {/* <Link to="/home/index">首页</Link>
        <Link to="/home/house">找房</Link>
       <Link to="/home/profile">我的</Link> */}
        <Route path="/home/index" component={Index} />
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