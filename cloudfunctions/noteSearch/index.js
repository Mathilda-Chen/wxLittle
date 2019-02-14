// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() 

const db = cloud.database({})

// 云函数入口函数
exports.main = async (event) => {
  console.log("event",event)
  let openId = event.userInfo.openId;
  // 上面是异步查询，并返回，所以用的是 await 。用await的好处是，可以把异步代码像同步一样去写。
  return await db.collection('yg_note').where({ _id: event._id }).get()
}