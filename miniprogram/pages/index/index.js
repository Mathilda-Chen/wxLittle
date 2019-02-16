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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
  touchStart(e) {
    var index = e.currentTarget.dataset.index;
    var beIndex = this.data.beIndex;
    if(index != beIndex && beIndex != -1) {
      var list = this.data.info;
      list[this.data.beIndex].right = 0;
    }
    this.setData ({
      startX: e.touches[0].clientX,
      beIndex: index,
      index: index
    })
  },
  touchMove: function (e) {
    var moveX = e.touches[0].clientX;
    var disX = this.data.startX - moveX;
    var right = 0;
    if(disX == 0 || disX < 0) {
      right = 0;
    }else if (disX > 0){
      right = disX > maxRight ? maxRight : disX;
    }
    var list = this.data.info;
    list[this.data.index].right = right;
    this.setData ({
      info: list
    })
  },
  touchEnd(e) {
    var endX = e.changedTouches[0].clientX;
    var disX = this.data.startX - endX;
    var right = disX > maxRight/2 ? maxRight: 0;
    var list = this.data.info;
    list[this.data.index].right = right;
    this.setData ({
      info: list,
    })
  },
  toshare(e) {

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