import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';

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
  render() {
    return (
      <div>
        <Link to="/home/index">首页</Link>
        <Link to="/home/house">找房</Link>
        <Link to="/home/profile">我的</Link>
        <Route path="/home/index" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/profile" component={Profile} />
      </div>
    );
  }
}

export default Home;