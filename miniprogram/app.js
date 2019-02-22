//app.js
App({
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    env: "bill1902-text-d05f84",
    userinfo: ""
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 判断是否授权或者有缓存
    var self = this;
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        if (res.data) {
          self.globalData.userinfo = res.data;
          let url = '/pages/index/index'
          wx.reLaunch({
            url,
          })
        }
      }
    })
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
})
