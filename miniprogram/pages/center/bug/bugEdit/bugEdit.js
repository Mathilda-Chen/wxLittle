// pages/center/bug/bugEdit/bugEdit.js

const app = getApp()
const util = require('../../../../utils/dateUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      title: "",
      content: "",
      checked: false,
    },
    editPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options._id) {
      this.getData(options._id);
    }else{
      this.setData({
        editPage: false
      })
    }
  },
  getData (e) {
    app.getCloud("bugSearch", { _id: e }, res => {
      this.setData({
        info: res.result.data[0]
      })
    })
  },
  toHandle () {
    this.setData ({
      [`info.checked`]: !this.data.info.checked
    })
  },
  bindTitle: function (e) {
    this.setData({
      ['info.title']: e.detail.value
    })
  },
  bindContent: function (e) {
    this.setData({
      ['info.content']: e.detail.value
    })
  },
  bindWay: function (e) {
    this.setData({
      ['info.way']: e.detail.value
    })
  },
  toSave: function () {
    if (!this.data.info.title || !this.data.info.content) {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
      })
    } else if (!this.data.info.way && this.data.editPage){
      wx.showToast({
        title: '请填写解决办法',
        icon: 'none',
      })
    }else{
      var self = this;
      var currentTime = util.getTime();
      if (this.data.editPage) {
        this.setData({
          [`info.end_time`]: currentTime
        })
      }else {
        this.setData({
          [`info.create_time`]: currentTime
        })
      }
      wx.showModal({
        title: '提示',
        content: '确定保存吗',
        success: function (res) {
          if (res.confirm) {
            app.getCloud('bugEdit', { info: self.data.info }, res => {
              wx.navigateBack()
            })
          }
        }
      })
    }
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