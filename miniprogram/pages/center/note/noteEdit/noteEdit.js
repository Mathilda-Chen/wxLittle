// pages/center/note/noteEdit/noteEdit.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options._id) {
      app.getCloud('noteSearch', { _id: options._id }, res => {
        this.setData({ info: res.result.data[0] })
      })
    }
  },
  bindInput: function (e) {
    this.setData({
      ['info.title']: e.detail.value
    })
  },
  bindTextarea: function (e) {
    this.setData({
      ['info.content']: e.detail.value
    })
  },
  toSave: function () {
    if (!this.data.info.title) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
      })
    } else {
      var self = this;
      wx.showModal({
        title: '提示',
        content: '确定保存吗',
        success: function (res) {
          if (res.confirm) {
            app.getCloud('noteEdit', { info: self.data.info }, res => {
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
    // wx.showModal({
    //   title: '提示',
    //   content: '确定保存吗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       app.getCloud('noteEdit', { info: this.data.info }, res => {
    //         wx.navigateBack()
    //       })
    //     }
    //   }
    // })
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