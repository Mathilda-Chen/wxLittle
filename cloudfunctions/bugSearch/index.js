// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({})

const _ = db.command;

// 云函数入口函数
exports.main = async (event) => {
  console.log("event", event)
  // 上面是异步查询，并返回，所以用的是 await 。用await的好处是，可以把异步代码像同步一样去写。
  let checked;
  if (event.status){
    if (event.status == 1) {
      checked = true;
    } else if (event.status == 2) {
      checked = false;
    }
  }
  let compareTime;
  if (event.startTime) {
    compareTime = _.gt(event.startTime).and(_.lt(event.endTime));
  }
  return await 
    db.collection('yg_bug').where({
      checked: checked,
      create_time: compareTime
    }).orderBy('create_time', 'desc').get()
}