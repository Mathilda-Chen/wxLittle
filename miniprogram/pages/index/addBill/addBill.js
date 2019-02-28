// pages/index/addBill/addBill.js
const app = getApp();
const util = require('../../../utils/dateUtil.js');
const CATE = require('../../../utils/cate.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.statusBarHeight + 88,
    scrollHeight: app.globalData.clientHeight - app.globalData.statusBarHeight - 88 - 40 - 120 - 82 - 444 - 40 + 5,
    bookid: 0,
    money: "0.00",
    tab: ["支出", "收入"],
    cate: [CATE.INCOME, CATE.OUTCOME],
    cateIndex: 0,
    num: [7, 8, 9, 4, 5, 6, 1, 2, 3, "清空", 0, ""],
    remarks: "",
    typeIndex: 0,
    scrollTop: 0,
    _id: 0,
    editPage: false,
    pick_date: app.globalData.cur_all_time,
    date: app.globalData.cur_all_time,
    edit_date: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.bill){
      var billInfo = JSON.parse(options.bill);
      var time = billInfo.time;
      this.setData({
        money: billInfo.money,
        remarks: billInfo.remarks,
        typeIndex: billInfo.type,
        cateIndex: billInfo.cate_id,
        date: [time.substring(0, 4), time.substring(5, 7), time.substring(8, 10)],
        edit_date: [time.substring(0, 4), time.substring(5, 7), time.substring(8, 10)],
        editPage: true,
        _id: billInfo._id
      })
    }
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
    var index = e.currentTarget.dataset.index;
    this.setData({
      cateIndex: index
    })
  },
  // 输入金额
  inputNum(e) {
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.item;
    if (index == 11) {
      num = "."
    } else if (index == 10) {
      num = 0;
    }
    var len = this.data.money.length,
     cur_money = this.data.money == "0.00" ? "" : this.data.money,
     money = `${cur_money}${num}`,
     dot = JSON.stringify(cur_money).indexOf(".") != -1;
    if (index == 9 || (cur_money == "" && !num)) {
      this.setData ({
        money: "0.00"
      })
      return;
    }
    if (len >= 8) return;
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
    var date = e.detail.value.split("-");
    this.setData({
      date: date,
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
    if(this.data.editPage) {
      // 修改数据
      var param = {
        type: this.data.typeIndex,
        cate: this.data.cate[this.data.typeIndex][this.data.cateIndex].name,
        cate_id: this.data.cate[this.data.typeIndex][this.data.cateIndex].cate_id,
        remarks: this.data.remarks,
        time: util.changeTime(this.data.date, false, util.getHour()),
        nickName: app.globalData.userinfo.nickName,
        money: money,
        imgUrl: this.data.cate[this.data.typeIndex][this.data.cateIndex].imgUrl
      };
      app.editData('bills', self.data._id, param, res => {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
      })
    } else { 
      // 存储数据
      var param = {
        bookid: app.globalData.cur_bookid,
        type: this.data.typeIndex,
        cate: this.data.cate[this.data.typeIndex][this.data.cateIndex].name,
        cate_id: this.data.cate[this.data.typeIndex][this.data.cateIndex].cate_id,
        remarks: this.data.remarks,
        time: util.changeTime(this.data.date, false, util.getHour()),
        nickName: app.globalData.userinfo.nickName,
        money: money,
        imgUrl: this.data.cate[this.data.typeIndex][this.data.cateIndex].imgUrl
      }
      app.addData('bills', param, res => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
      })
    }
    var index_date = app.globalData.index_date; //首页时间
    var count_date = app.globalData.count_date; //图标页时间
    var edit_date = this.data.edit_date; //编辑前 （string）
    var add_date = this.data.date; //编辑或添加最后时间（string）
    let event_1 = count_date[0] == edit_date[0] && count_date[1] == edit_date[1]; //编辑前时间与图表相同
    let event_2 = count_date[0] == add_date[0] && count_date[1] == add_date[1]; //编辑后时间与图表相同
    let event_3 = index_date[0] == edit_date[0] && index_date[1] == edit_date[1]; //编辑前时间与首页相同
    let event_4 = index_date[0] == add_date[0] && index_date[1] == add_date[1]; //编辑后时间与首页相同
    if (event_3 || event_4) {
      app.globalData.indexFlag = true;
    }
    if (event_1 || event_2) {
      app.globalData.countFlag = true;
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