// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({})

// 云函数入口函数
exports.main = async (event) => {
  const openId = cloud.getWXContext().OPENID;
  if(event.info) {
    return await db.collection('yg_user').add({
      data: {
        avatarUrl: event.info.avatarUrl,
        city: event.info.city,
        country: event.info.country,
        gender: event.info.gender,
        nickName: event.info.nickName,
        openID: openId,
        province: event.info.province,
      }
    })
  }else{
    return await db.collection('yg_user').where({ openID: openId }).get();
  }
}
