import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils'

/* 
  封装 AuthRoute 鉴权路由组件：

  1 在 components 目录中创建 AuthRoute/index.js 文件。
  2 创建组件 AuthRoute 并导出。
  3 在 AuthRoute 组件中返回 Route 组件（在 Route 基础上做了一层包装，用于实现自定义功能）。
  4 给 Route 组件，添加 render 方法，指定该组件要渲染的内容（类似于 component 属性）。
  5 在 render 方法中，调用 isAuth() 判断是否登录。
  6 如果登录了，就渲染当前组件（通过参数 component 获取到要渲染的组件，需要重命名）。
  7 如果没有登录，就重定向到登录页面，并且指定登录成功后要跳转到的页面路径。
  8 将 AuthRoute 组件接收到的 props 原样传递给 Route 组件（保证与 Route 组件使用方式相同）。
  9 使用 AuthRoute 组件配置路由规则，验证能否实现页面的登录访问控制。
*/

// <AuthRoute path="..." component={...}></AuthRoute>
const AuthRoute = ({ component: Component, ...rest }) => {
  console.log('rest', rest)
  return (
    <Route
      {...rest}
      render={props => {
        const isLogin = isAuth()

        if (isLogin) {
          // 已登录
          // 将 props 传递给组件，组件中才能获取到路由相关信息
          return <Component {...props} />
        } else {
          // 未登录
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  backUrl: props.location
                }
              }}
            />
          )
        }
      }}
    />
  )
}

export default AuthRoute
