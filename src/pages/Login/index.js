import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import styles from './index.module.css'
import { login } from '../../utils/api/user'
import { setToken } from '../../utils'

import { withFormik } from 'formik'
import * as yup from 'yup'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: '',
  //   password: ''
  // }

  // // 处理表单输入
  // handlerForm = (e) => {
  //   // console.log(e);
  //   let name = e.target.name;
  //   this.setState({
  //     [name]: e.target.value
  //   })
  // }

  // 处理登录
  // handlerLogin = async (e) => {
  //   // 阻止表单默认action行为
  //   e.preventDefault();
  //   console.log(this.state.username, this.state.password);
  //   const { username, password } = this.state;
  //   let data = {
  //     username,
  //     password
  //   }
  //   let res = await login(data);
  //   console.log(res)
  //   if (res.status === 200) {
  //     setLocalData(TOKEN, res.data.token);
  //     this.props.history.push('/')
  //   } else {
  //     Toast.offline(res.description)
  //   }
  // }



  render() {
    const {
      values,
      // touched,
      errors,
      handleChange,
      handleSubmit } = this.props;
    // console.log(touched, errors)
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">
          账号登录
        </NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {errors.username && <div className={styles.error}>{errors.username}</div>}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {errors.password && <div className={styles.error}>{errors.password}</div>}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default withFormik({
  // 提供表单的状态数据和当前表单的input的name属性值一一对应
  mapPropsToValues: () => ({ username: 'test2', password: 'test2' }),
  // 验证表单
  validationSchema: yup.object().shape({
    username: yup.string().required('账号为必填项！').matches(REG_UNAME, '账号长度为5到8位，只能出现数字、字母、下划线'),
    password: yup.string().required('密码为必填项！').matches(REG_PWD, '密码长度为5到12位，只能出现数字、字母、下划线'),
  }),
  // 处理表单提交
  // handleSubmit: (values: Values, formikBag: FormikBag) => void | Promise<any>
  handleSubmit: async (values, formikBag) => {
    console.log(formikBag)
    const { username, password } = values;
    console.log(username, password)
    let data = {
      username,
      password
    }
    let res = await login(data);
    console.log(res)
    if (res.status === 200) {
      setToken(res.data.token);
      formikBag.props.history.push('/home/profile')
    } else {
      Toast.offline(res.description)
    }
  },
})(Login)
