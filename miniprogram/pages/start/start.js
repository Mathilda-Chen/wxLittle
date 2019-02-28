// pages/start/start.js
const app = getApp();
const util = require('../../utils/dateUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.statusBarHeight + 44,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: 'userinfo',
      success(res) {
        if (res.data) {
          app.globalData.userinfo = res.data;
          app.globalData.openId = res.data._openid;
          self.direct();
        }
      }
    })
  },
  onGotUserInfo(e) {
    if (e && e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        user: e.detail.userInfo
      })
      app.getCloud('login', { info: this.data.user, time: util.getTime() }, res => {
        this.login();
      })
    }
  },
  login() {
    app.getCloud('login', {}, res => {
      // console.log(res.result)
      if (!res.result.data.length) return;
      wx.setStorage({
        key: 'userinfo',
        data: res.result.data[0],
      })
      app.globalData.userinfo = res.result.data[0];
      app.globalData.openId = res.result.data[0]._openid;
      this.toNext();
    })
  },
  toNext() {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 10)
  },
  direct() {
    let url = '/pages/index/index'
    wx.switchTab({
      url,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})