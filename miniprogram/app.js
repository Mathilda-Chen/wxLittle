//app.js
App({
  globalData: {
    doubanBase: "https://douban.uieee.com",
    keBase: "https://36kr.com"
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },
  // 调用云函数
  getCloud(name, data, callback){
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: callback,
      fail: err => {
        console.error('调用失败', err)
      }
    })
  },
  // 请求其他数据
  getOther(url, data, callback){
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'json' // 默认值
      },
      success: callback,
      fail: err => {
        console.error('调用失败', err)
      }
    })
  },

})
