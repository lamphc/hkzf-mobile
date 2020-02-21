import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  NavBar,
  Icon,
  Toast
} from 'antd-mobile'

import HousePackage from '../../../components/HousePackage'

import styles from './index.module.css'
import { uploadHouseImgs, pubHouse } from '../../../utils/api/user'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    const { state = {} } = this.props.location;

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: state.name,
        id: state.id
      },
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 获取输入的值
  getInputVal = (name, val) => {
    console.log(name, val)
    this.setState({
      [name]: val
    })
  }

  // 选择配套
  selPack = (selNames) => {
    console.log(selNames);
    this.setState({
      supporting: selNames.join('|')
    })
  }

  // 获取房屋图片
  // files: Object, operationType: string, index: number
  getImg = (files, operationType, index) => {
    console.log(files, operationType, index)
    this.setState({
      tempSlides: files
    })
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // 发布房源
  addHouse = async () => {
    const {
      tempSlides,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state;
    // 处理边界
    if (!title || !size || !price) {
      return Toast.info('请输入房源基本信息！', 1)
    }
    // 上传图片，获取上传位置
    let houseImg;
    if (tempSlides.length) {
      let fm = new FormData();
      tempSlides.forEach((item) => fm.append('file', item.file));
      let res = await uploadHouseImgs(fm);
      console.log(res)
      if (res.status === 200) {
        houseImg = res.data.join('|')
      } else {
        Toast.fail(res.description, 2)
      }
    }
    // 处理其它数据
    const otd = {
      title,
      description,
      houseImg,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id
    };
    let ores = await pubHouse(otd)
    console.log('form all data:', otd)
    if (ores.status === 200) {
      Toast.success('发布成功！', 1, () => {
        this.props.history.push('/rent')
      })
    } else {
      if (ores.status === 400) {
        Toast.info('请重新登录！', 1, () => {
          // 传入回跳地址
          this.props.history.push('/login', { backUrl: this.props.location.pathname })
        })
      }
    }

  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          icon={<Icon type="left" />}
          mode="dark"
          onLeftClick={this.onCancel}
        >
          发布房源
        </NavBar>
        <List
          className={styles.header}
          renderHeader={() => '基本信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请选择小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem placeholder="请输入租金/月" extra="￥/月" type="number" value={price}
            onChange={(v) => {
              this.getInputVal('price', v)
            }}>
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡" type="number" value={size}
            onChange={(v) => {
              this.getInputVal('size', v)
            }}
          >
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} value={[roomType]} cols={1}
            onChange={(v) => {
              this.getInputVal('roomType', v[0])
            }}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker data={floorData} value={[floor]} cols={1}
            onChange={(v) => {
              this.getInputVal('floor', v[0])
            }}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker data={orientedData} value={[oriented]} cols={1}
            onChange={(v) => {
              this.getInputVal('oriented', v[0])
            }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(v) => {
              this.getInputVal('title', v)
            }}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            onChange={this.getImg}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage select onSelect={this.selPack} />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(v) => {
              this.getInputVal('description', v)
            }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
