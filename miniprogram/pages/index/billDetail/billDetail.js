// pages/index/billDetail/billDetail.js
const util = require('../../../utils/dateUtil.js');

var maxRight = 120;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 440,
    money: "0.00",
    tab: ["收入", "支出"],
    num: [7, 8, 9, 4, 5, 6, 1, 2, 3, "清空", 0, "."],
    date: "",
    beIndex: 0,
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
          scrollHeight: height - 80 - 120 - 102 - 404 - 40
        })
      },
    })
    var time = util.formatDate(util.getTime()).split(" ")[0].substring(5,11)
    this.setData ({
      date: time
    })
  },
  checkTab(e) {
    var index = e.currentTarget.dataset.index;
    this.setData ({
      beIndex: index
    })
  },
  bindTitle(e) {
    this.setData ({
      title: e.detail.value
    })
  },
  inputNum(e) {
    var num = e.currentTarget.dataset.item,
     len = this.data.money.length,
     cur_money = this.data.money == "0.00" ? "" : this.data.money,
     money = `${cur_money}${num}`,
     dot = cur_money.indexOf(".") != -1;
    if(num == "清空") {
      this.setData ({
        money: "0.00"
      })
      return;
    }
    if (len > 20) return;
    if(dot){
      var dotLen = cur_money.split(".")[1].length;
      if (num == "." || dotLen > 1) return;
    }
    if (num == "." && !dot && cur_money == "") {
      money = "0."
    }
    this.setData({
      money: money
    })
  },
  numDel() {
    if (this.data.money == "0.00") return;
    var len = this.data.money.length;
    var money;
    if (len == 1) {
      money = "0.00"
    }else if(len > 0) {
      money = this.data.money.substr(0, len - 1);
    }
    this.setData({
      money: money
    })
  },
  bindDateChange(e) {
    var arr = e.detail.value.split("-");
    this.setData({
      date: `${arr[1]}月${arr[2]}日`
    })
  },
  toSave() {
    var money = this.data.money;
    if(money == "0.00") {
      wx.showToast({
        title: '请输入金额！',
        icon: 'none',
      })
      return;
    }
    // var currentTime = util.getTime();
    // console.log(currentTime)
    if(money.substr(-1) == ".") {
      money = money.substring(0, money.length-1)
    }
    wx.navigateBack()
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