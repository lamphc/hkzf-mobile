import React from 'react';
// import { Button } from 'antd-mobile';

import { BrowserRouter as Router, Link, Route, Redirect, Switch } from 'react-router-dom';
// 导入业务功能组件
import Home from './pages/Home';
import CityList from './pages/CityList';
import Map from './pages/Map';
import HouseDetail from './components/HouseDetail';

const NotFound = () => <center><h2>404...</h2></center>

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          {/* <Button type="primary">按钮</Button> */}
          {/* <Link to="/home">首页</Link>
        <Link to="/cityList">城市选择</Link> */}
          {/* 一级路由 */}
          <Route exact path="/" render={() => <Redirect to="/home/index" />} />
          <Route path="/home" component={Home} />
          {/* 房屋 */}
          <Route path="/detail/:id" component={HouseDetail} />
          <Route path="/map" component={Map} />
          <Route path="/cityList" component={CityList} />
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
