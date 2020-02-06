import React from 'react'

import PropTypes from 'prop-types'
// props
// 1. cheldren -> 获取组件动态内容  <Child>adadsd</Child>
// 2. defautProps -> 为组件设置默认属性  num
// 3. prop-types -> 为组件的属性提供默认类型  age

import styles from './index.module.css'

function HouseItem({ src, title, desc, tags, price, onClick, style }) {
  return (
    <div className={styles.house} onClick={onClick} style={style}>
      <div className={styles.imgWrap}>
        <img className={styles.img} src={src} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {/* ['近地铁', '随时看房'] */}
          {tags.map((tag, index) => {
            const tagClass = 'tag' + (index + 1)
            return (
              <span
                className={[styles.tag, styles[tagClass]].join(' ')}
                key={tag}
              >
                {tag}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}


HouseItem.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number,
  onClick: PropTypes.func
}

export default HouseItem
