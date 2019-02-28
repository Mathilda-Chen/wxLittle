//app.js
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');

// wx.cloud.init({
//   env: 'bill1902-online-9c3e8c'
// })
wx.cloud.init({
  env: 'bill1902-text-d05f84'
})
const db = wx.cloud.database();
const _ = db.command;
const dateUtil = require("/utils/dateUtil.js")

App({
  globalData: { 
    ratio: 0,
    statusBarHeight: 0,
    clientHeight: 0,
    userinfo: "",
    openId: 0,
    cur_time: [], //年月
    cur_all_time: [],
    cur_timestamp: [], //年月
    index_date: [],
    add_date: [],
    cur_bookid: 0,
    indexFlag: false,
    countFlag: false,
    index_date: [],
    count_date: []
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env: 'bill1902-online-9c3e8c',
        env: 'bill1902-text - d05f84',
        traceUser: true,
      })
    }
    this.getTime();
    this.getRatio();
    // 判断是否授权或者有缓存
    var self = this;
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        if (res.data) {
          self.globalData.userinfo = res.data;
          self.globalData.openId = res.data._openid;
          let url = '/pages/index/index'
          wx.reLaunch({
            url
          })
        }
      }
    })
  },
  // 获取屏幕转换比例
  getRatio() {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        self.globalData.ratio = ratio;
        self.globalData.clientHeight = res.windowHeight * ratio;
        self.globalData.statusBarHeight = res.statusBarHeight * ratio
      }
    })
  },
  // 获取当前时间
  getTime() {
    // cur_time: [2019, 2, 27]
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    this.globalData.cur_time = [year, month];
    this.globalData.cur_all_time = [year, month, day];
    this.globalData.index_date = [year, month];
    this.globalData.count_date = [year, month];
    // cur_timestamp: [1548950400000, 1551369600000]
    let startTime = dateUtil.changeTime([year, month], false)
    let endTime = dateUtil.changeTime([year, month+1], false)
    this.globalData.cur_timestamp = [startTime, endTime];
    /**
     * 此处可以优化
     */
    this.globalData.year = year;
    this.globalData.month = month;
    this.globalData.day = day;
  },
  // 调用云函数
  getCloud(name, data, callback) {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: callback,
      fail: err => {
        console.error('调用失败', err)
      }
    })
  },
  // 查询数据
  searchData(name, param, time, page, callback) {
    if(time[0]) {
      var compareTime = _.gte(time[0]).and(_.lte(time[1]));
      param.time = compareTime;
    }
    db.collection(name).where(param).orderBy('time', 'desc').skip(20 * page).get({
      success: callback,
      fail: err => {
        console.error('获取失败', err)
      } 
    })
  },
  // 添加数据
  addData(name, param, callback) {
    db.collection(name).add({
      data:param,
      success: callback,
      fail: err => {
        console.error('添加失败', err)
      } 
    })
  },
  // 删除数据
  delData(name, id, callback) {
    db.collection(name).doc(id).remove({
      success: callback,
      fail: err => {
        console.error('删除失败', err)
      } 
    });
  },
  // 修改数据
  editData(name, id, param, callback) {
    db.collection(name).doc(id).update({
      data: param,
      success: callback,
      fail: err => {
        console.error('更新失败', err)
      }  
    })
  },
  // 查询数据数量
  countData(name, param, time, callback){
    if (time[0]) {
      var compareTime = _.gte(time[0]).and(_.lte(time[1]));
      param.time = compareTime;
    }
    db.collection(name).where(param).count ({
      success: callback,
      fail: err => {
        console.error('查询失败', err)
      } 
    }     
  )},
  // 格式化数据
  formatData(arr){
    arr.forEach(e => {
      if (!isNaN(e.time)){
        e.time = dateUtil.formatDate(e.time).split(' ')[0];
      }
    })
    let newArr = [];
    arr.forEach((a, i) => {
      let index = -1;
      let alreadyExsists = newArr.some((nA, j) => {
        if (a.time == nA.time) {
          index = j;
          return true;
        }
      });
      // 存在相同日期
      if (alreadyExsists) {
        if (a.type) {
          newArr[index].income += parseInt(a.money)
        } else {
          newArr[index].outcome += parseInt(a.money)
        }
        newArr[index].bill.push(a);
        return;
      }
      // 不存在且原数据为空
      if (!alreadyExsists && a.bill == undefined) {
        newArr.push({
          time: a.time,
          income: a.type ? parseInt(a.money) : 0,
          outcome: a.type ? 0 : parseInt(a.money),
          bill: [a]
        });
      } else {
        newArr.push(a)
      }
    })
    return newArr
  }
})
