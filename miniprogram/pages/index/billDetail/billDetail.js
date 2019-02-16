// pages/index/billDetail/billDetail.js
const util = require('../../../utils/dateUtil.js');

var maxRight = 120;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 1000,
    title: "",
    list: [],
    index: -1,
    beIndex: -1,
    startX: "",
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 计算屏幕高度
    let self = this;
    wx.getSystemInfo({
      success: function(res) {  
        let clientWidth = res.windowWidth; 
        let clientHeight = res.windowHeight;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        self.setData ({
          windowHeight: height - 140
        })
      },
    })
  },
  touchStart(e) {
    var index = e.currentTarget.dataset.index;
    var beIndex = this.data.beIndex;
    if (index != beIndex && beIndex != -1) {
      var list = this.data.list;
      list[this.data.beIndex].right = 0;
    }
    this.setData({
      startX: e.touches[0].clientX,
      beIndex: index,
      index: index
    })
  },
  touchMove: function (e) {
    var moveX = e.touches[0].clientX;
    var disX = this.data.startX - moveX;
    var right = 0;
    if (disX == 0 || disX < 0) {
      right = 0;
    } else if (disX > 0) {
      right = disX > maxRight ? maxRight : disX;
    }
    var list = this.data.list;
    list[this.data.index].right = right;
    this.setData({
      list: list
    })
  },
  touchEnd(e) {
    var endX = e.changedTouches[0].clientX;
    var disX = this.data.startX - endX;
    var right = disX > maxRight / 2 ? maxRight : 0;
    var list = this.data.list;
    list[this.data.index].right = right;
    this.setData({
      list: list,
    })
  },
  bindTitle(e) {
    this.setData ({
      title: e.detail.value
    })
  },
  bindChecked(e) {
    var index = e.currentTarget.dataset.index;
    var checked = this.data.list[index].checked;
    this.setData ({
      [`list[${index}].checked`]: !checked
    })
  },
  bindContent(e) {
    var index = e.currentTarget.dataset.index;
    this.setData ({
      [`list[${index}].text`]: e.detail.value
    })
  },
  addItem() {
    var item = {checked: "", text: ""}
    var list = this.data.list;
    list.push(item);
    this.setData ({
      list: list,
      scrollTop: this.data.scrollTop + 96
    })
  },
  toSave() {
    var self = this;
    // var currentTime = util.getTime();
    // console.log(currentTime)
    // wx.showModal({
    //   title: '提示',
    //   content: '确定保存吗',
    //   success: function (res) {
    //     if (res.confirm) {
    //       var item = {
    //         title: self.data.title,
    //         content: self.data.list,
    //         create_time: util.getTime()
    //       }
    //       var arr = wx.getStorageSync("history") || [];
    //       arr.unshift(item);
    //       console.log(arr)
    //       wx.setStorage({
    //         key: 'history',
    //         data: arr,
    //       })
    //       // app.getCloud('bugEdit', { info: self.data.info }, res => {
    //         wx.navigateBack()
    //       // })
    //     }
    //   }
    // })
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