import React, { lazy, Suspense } from 'react';
// import { Button } from 'antd-mobile';

import { HashRouter as Router, Link, Route, Redirect, Switch } from 'react-router-dom';
// 路由守卫
import AuthRoute from './components/AuthRoute'
// 导入业务功能组件
import Home from './pages/Home';
import { Rou } from './utils/axios';
// const Home = lazy(() => import('./pages/Home'));
// import CityList from './pages/CityList';
// import Map from './pages/Map';
// import HouseDetail from './components/HouseDetail';
// import Login from './pages/Login';

// import Rent from './pages/Rent';
// import RentAdd from './pages/Rent/Add';
// import RentSearch from './pages/Rent/Search';
// 懒加载处理
const CityList = lazy(() => import('./pages/CityList'));
const Map = lazy(() => import('./pages/Map'));
const HouseDetail = lazy(() => import('./components/HouseDetail'));
const Login = lazy(() => import('./pages/Login'));

const Rent = lazy(() => import('./pages/Rent'));
const RentAdd = lazy(() => import('./pages/Rent/Add'));
const RentSearch = lazy(() => import('./pages/Rent/Search'));



const NotFound = () => <center><h2>404...</h2></center>

function App() {
  return (
    <Router>
      <Suspense fallback={<center>loading...</center>}>
        <div className="app">
          <Rou />
          <Switch>
            {/* <Button type="primary">按钮</Button> */}
            {/* <Link to="/home">首页</Link>
        <Link to="/cityList">城市选择</Link> */}
            {/* 一级路由 */}
            <Route exact path="/" render={() => <Redirect to="/home" />} />
            <Route path="/home" component={Home} />
            {/* 房屋 */}
            <Route path="/detail/:id" component={HouseDetail} />
            {/* 登录 */}
            <Route path="/login" component={Login} />
            {/* 房源管理 */}
            {/* <Route path="/rent" exact component={Rent} />
            <Route path="/rent/add" component={RentAdd} />
            <Route path="/rent/search" component={RentSearch} /> */}
            <AuthRoute path="/rent" exact component={Rent} />
            <AuthRoute path="/rent/add" component={RentAdd} />
            <AuthRoute path="/rent/search" component={RentSearch} />

            <Route path="/map" component={Map} />
            <Route path="/cityList" component={CityList} />
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
