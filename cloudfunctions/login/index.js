// 云函数模板

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

// const db = cloud.database({ env: 'bill1902-online-9c3e8c' })
const db = cloud.database({ env: 'bill1902-text-d05f84' })

exports.main = async (event) => {
  console.log('event', event)
  const openId = cloud.getWXContext().OPENID;
  const info = await db.collection('user').where({ _openid: openId }).get()
  if(info.data.length == 0 && event.info) {
    await db.collection('books').add({
      data: {
        bookname: `${event.info.nickName}的记账本`,
        is_default: 1, 
        create_time: event.time,
        identity: 0,
        _openid: openId
      }
    })
    await db.collection('user').add({
      data: {
        avatarUrl: event.info.avatarUrl,
        city: event.info.city,
        country: event.info.country,
        gender: event.info.gender,
        nickName: event.info.nickName,
        _openid: openId,
        province: event.info.province,
        create_time: event.time
      }
    })
  }else {
    return info
  }
}
