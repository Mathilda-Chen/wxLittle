// pages/index/addBill/addBill.js
const app = getApp();
const util = require('../../../utils/dateUtil.js');
const cate = require('../../../utils/cate.js')
const env = app.globalData.env;
const db = wx.cloud.database({ env: env });

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 440,
    bookid: 0,
    money: "0.00",
    tab: ["支出", "收入"],
    cate: [],
    cateIndex: 0,
    num: [7, 8, 9, 4, 5, 6, 1, 2, 3, "清空", 0, "."],
    remarks: "",
    date: "",
    dateTimestamp: 0,
    typeIndex: 0,
    scrollTop: 0,
    _id: 0,
    editPage: false
    // billInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWindowHeight();
    // console.log(options)
    // var bookid = "XGu7hN7E7L4wLoPE";
    // var self = this;
    // wx.getStorage({
    //   key: 'userinfo',
    //   success(res) {
    //     if (res.data) {
    //       app.globalData.userinfo = res.data.data[0];
    //     }
    //   }
    // })
    console.log(options)
    this.setData({
      [`cate[0]`]: cate.INCOME,
      [`cate[1]`]: cate.OUTCOME,
      dateTimestamp: util.getTime(),
    })
    if(options.bill){
      var billInfo = JSON.parse(options.bill);
      this.setData({
        money: billInfo.money,
        remarks: billInfo.remarks,
        typeIndex: billInfo.type,
        cateIndex: billInfo.cate_id,
        date: billInfo.time.substr(5,11),
        editPage: true,
        _id: billInfo._id
      })
    }else {
      this.setData({
        bookid: options.bookid,
      })
    }

  },
  // 获取屏幕高度
  getWindowHeight() {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientWidth = res.windowWidth;
        let clientHeight = res.windowHeight;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        self.setData({
          scrollHeight: height
        })
      },
    })
    var time = util.formatDate(util.getTime()).split(" ")[0].substring(5, 11)
    this.setData({
      date: time,
      scrollHeight: this.data.scrollHeight - 82 - 120 - 102 - 404 - 42
    })
  },
  // 切换栏
  checkTab(e) {
    var index = e.currentTarget.dataset.index;
    this.setData ({
      typeIndex: index,
      scrollTop: 0,
      cateIndex: 0,
      money: "0.00",
      remarks: ""
    })
  },
  // 选择类别
  selCate(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      cateIndex: index
    })
  },
  // 输入金额
  inputNum(e) {
    var num = e.currentTarget.dataset.item,
     len = this.data.money.length,
     cur_money = this.data.money == "0.00" ? "" : this.data.money,
     money = `${cur_money}${num}`,
      dot = JSON.stringify(cur_money).indexOf(".") != -1;
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
  // 删除金额
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
  // 输入备注
  bindRemarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  // 选择日期
  bindDateChange(e) {
    var date = e.detail.value;
    var arr = date.split("-");
    this.setData({
      date: `${arr[1]}月${arr[2]}日`,
      dateTimestamp: util.changeTime(date)
    })
  },
  // 保存记录
  toSave() {
    var self = this;
    var money = this.data.money;
    if(money == "0.00") {
      wx.showToast({
        title: '请输入金额！',
        icon: 'none',
      })
      return;
    }
    if(money.substr(-1) == ".") {
      money = money.substring(0, money.length-1)
    }
    // 存储数据
    var param = {
      bookid: this.data.bookid,
      type: this.data.typeIndex,
      cate: this.data.cate[this.data.typeIndex][this.data.cateIndex].name,
      cate_id: this.data.cate[this.data.typeIndex][this.data.cateIndex].cate_id,
      remarks: this.data.remarks,
      time: this.data.dateTimestamp,
      nickName: app.globalData.userinfo.nickName,
      money: this.data.money
    }
    console.log(param)
    if(this.data.editPage) {
      db.collection('bills').doc(self.data._id).update({
        data: {
          type: self.data.typeIndex,
          cate: self.data.cate[self.data.typeIndex][self.data.cateIndex].name,
          cate_id: self.data.cate[self.data.typeIndex][self.data.cateIndex].cate_id,
          remarks: self.data.remarks,
          time: self.data.dateTimestamp,
          nickName: app.globalData.userinfo.nickName,
          money: self.data.money
        },
        success(res) {
          console.log(res.data)
        }
      })

    }else {
      db.collection('bills').add({
        data: param,
        success: res => {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '添加失败'
          })
        }
      })
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