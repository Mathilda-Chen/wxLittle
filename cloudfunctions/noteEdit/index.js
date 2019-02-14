// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({})

// 云函数入口函数
exports.main = async (event) => {
  console.log("event", event)
  let openId = event.userInfo.openId;
  if(event.info._id){
    return await db.collection('yg_note').doc(event.info._id).update({
      data: {
        title: event.info.title,
        content: event.info.content,
        cate: 1,
        openId: openId
      }
    })
  }else {
    return await db.collection('yg_note').add({
      data: {
        _id: event._id,
        title: event.info.title,
        content: event.info.content,
        cate: 1,
        openId: openId
      }
    })
  }
}