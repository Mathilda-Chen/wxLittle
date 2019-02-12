// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({})

// 云函数入口函数
exports.main = async (event) => {
  console.log("event", event)
  if (event.info._id) {
    return await db.collection('yg_bug').doc(event.info._id).update({
      data: {
        way: event.info.way,
        checked: event.info.checked,
        end_time: event.info.end_time
      }
    })
  } else {
    return await db.collection('yg_bug').add({
      data: {
        title: event.info.title,
        content: event.info.content,
        way: event.info.way,
        checked: event.info.checked,
        create_time: event.info.create_time,
        openId: cloud.getWXContext().OPENID
      }
    })
  }
}