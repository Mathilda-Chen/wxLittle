// pages/center/note/note.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    startX: '',
    beIndex: -1,
    showIndex: -1,
    pullFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getData();
  },
  getData: function () {
    app.getCloud('noteSearch', {}, res => {
      this.setData({ list: res.result.data })
      this.data.list.forEach(e => {
        e.rightLen = 0
      })
      if (this.data.pullFlag) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  toDetail: function (e) {
    this.setData({
      showIndex: -1
    })
    let data = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: `./noteDetail/noteDetail?_id=${data._id}`,
    })
  },
  toEdit: function (e) {
    var id = e.currentTarget.dataset.info ? e.currentTarget.dataset.info._id : "";
    wx.navigateTo({
      url: `./noteEdit/noteEdit?_id=${id}`,
    })
  },
  touchStart: function (e) {
    if (e.touches.length = 1) {
      var index = e.currentTarget.dataset.index;
      if (index != this.data.beIndex && this.data.beIndex != -1) {
        var list = this.data.list;
        list[this.data.beIndex].rightLen = 0;
      }
      this.setData({
        startX: e.touches[0].clientX,
        beIndex: index,
        showIndex: -1
      })
    }
  },
  touchMove: function (e) {
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var rightLen = 0;
      if (disX == 0 || disX < 0) {
        rightLen = 0
      } else if (disX > 0) {
        rightLen = disX;
        if (disX > 200) {
          rightLen = 200;
        }
      }
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].rightLen = rightLen;
      this.setData({
        list: list
      })
    }
  },
  touchEnd: function (e) {
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var rightLen = disX > 100 ? 200 : 0
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].rightLen = rightLen;
      this.setData({
        list: list,
        beIndex: index
      })
    }
  },
  toSet: function (e) {
    this.setData({
      showIndex: e.currentTarget.dataset.index
    })
  },
  toCloseMask: function () {
    this.setData({
      showIndex: -1
    })
  },
  toDel: function (e) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function (res) {
        if (res.confirm) {
          app.getCloud('noteDel', { _id: e.currentTarget.dataset.info._id }, res => {
            wx.showToast({
              title: "删除成功！"
            })
            self.getData();
          })
        } else {
          var index = e.currentTarget.dataset.index;
          self.setData({
            [`list[${index}].rightLen`]: 0,
          })
        }
      }
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
    this.getData();
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
    this.setData({
      pullFlag: true,
      showIndex: -1
    })
    wx.showNavigationBarLoading();
    this.getData();
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
