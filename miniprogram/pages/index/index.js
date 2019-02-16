// pages/index/index.js
const util = require('../../utils/dateUtil.js');

var maxRight = 240;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    index: -1,
    beIndex: -1,
    startX: "",
    openAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      navH: 150
    })
    this.getData();

  },
  getData() {
    var self = this;
    // wx.getStorage({
    //   key: 'history',
    //   success(res) {
    //     console.log(res.data)
    //     var list = res.data;
    //     list.forEach(e => {
    //       e.create_time = util.formatDate(e.create_time).split(' ')[0]
    //     })
    //     self.setData({
    //       info: list
    //     })
    //   }
    // })
  },
  showAdd() {
    this.setData ({
      addBook: !this.data.addBook
    })
  },
  toDel(e) {
    console.log("删除")
  },
  toDetail(e) {
    wx.navigateTo({
      url: "./billDetail/billDetail"
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