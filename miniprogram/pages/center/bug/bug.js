// pages/center/bug/bug.js
const app = getApp()
const util = require('../../../utils/dateUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    opIndex: -1,
    topTitle: ["全部", "已完成", "待完成"],
    // topTitle: ["2019.01", "全部"],
    ttIndex: 0,
    pullFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(0, "", "");
  },
  getData(status, startTime, endTime) {
    app.getCloud("bugSearch", { status: status, startTime: startTime, endTime: endTime}, res => {
      console.log(res)
      var list = res.result.data;
      list.forEach(e => {
        e.create_time = util.formatDate(e.create_time)
        e.end_time = util.formatDate(e.end_time)
      })
      this.setData({
        list: list
      })
      if (this.data.pullFlag) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  toOpen (e) {
    let index = e.currentTarget.dataset.index;
    if(index == this.data.opIndex) {
      this.setData ({
        opIndex: -1
      })
    }else{
      this.setData({
        opIndex: index
      })
    }
  },
  toDetail (e) {
    let _id = e.currentTarget.dataset.info._id;
    wx.navigateTo({
      url: `./bugEdit/bugEdit?_id=${_id}`,
    })
  },
  toEdit () {
    wx.navigateTo({
      url: `./bugEdit/bugEdit`,
    })
  },
  toSearch (e) {
    let index = e.currentTarget.dataset.index;
    this.setData ({
      ttIndex: index
    })
    this.getData(index, "", "")
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.calendar = this.selectComponent("#calendar");
  },
  showCalendar() {
    this.calendar.showCalendar();
  },
  _cancelEvent() {
    this.calendar.hideCalendar();
  },
  _confirmEvent(options) {
    this.calendar.hideCalendar();
    let year = options.detail.year;
    let month = parseInt(options.detail.month);
    let startTime = util.changeTime(`${year}-${month}`);
    let endTime = util.changeTime(`${year}-${month + 1}`);
    console.log(startTime, endTime)
    this.getData(0, startTime, endTime);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData(0, '', '');
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
      opIndex: -1,
      ttIndex: 0
    })
    wx.showNavigationBarLoading();
    this.getData(this.data.ttIndex, "", "");
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