import React from 'react';
// import { Button } from 'antd-mobile';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
// 导入业务功能组件
import Home from './pages/Home';
import CityList from './pages/CityList';

function App() {
  return (
    <Router className="App">
      {/* <Button type="primary">按钮</Button> */}
      {/* <Link to="/home">首页</Link>
      <Link to="/cityList">城市选择</Link> */}
      <Route path="/home" component={Home} />
      {/* <Route path="/cityList" component={CityList} /> */}
    </Router>
  );
}

export default App;
