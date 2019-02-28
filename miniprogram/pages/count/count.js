// pages/count/count.js 
const app = getApp();
const util = require('../../utils/dateUtil.js');
const env = app.globalData.env;
const db = wx.cloud.database({ env: env });
const _ = db.command;
let wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.statusBarHeight + 88,
    pick_date: app.globalData.cur_time,
    date: app.globalData.cur_time,
    datestamp: app.globalData.cur_timestamp,
    bookid: 0,
    // bills: [],
    allIncome: 0,
    allOutcome: 0,
    allBalance: 0,
    cur_year: app.globalData.year,
    cur_month: app.globalData.month,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!app.globalData.cur_bookid) {
      this.getMothElectro();
      return;
    }
    this.setData ({
      bookid: app.globalData.cur_bookid,
    })
    this.getBills(app.globalData.openId, app.globalData.cur_bookid);
  },
  // 获取账本账单
  getBills(openId, bookid) {
    var self = this;
    app.countData('bills', { _openid: openId, bookid: bookid }, self.data.datestamp, res => {
      var total = res.total;
      if (!total) {
        self.getMothElectro();
        return;
      }
      var times = Math.ceil(total / 20);
      var info = [];
      var i;
      for(i = 0;i<times;i++){
        var param = {
          _openid: openId,
          bookid: bookid,
        };
        app.searchData('bills', param, self.data.datestamp, i, res => {
          var arr = res.data;
          if (info.length) {
            arr = info.concat(arr);
          }
          info = app.formatData(arr);
          if (i == times) {
            self.getMothElectro(info);
          }

          // var arr = res.data;
          // var len = arr.length;
          // if (self.data.bills.length) {
          //   arr = self.data.bills.concat(arr);
          // }
          // var newArr = app.formatData(arr);
          // self.setData({
          //   bills: newArr,
          // })
          // console.log(self.data.bills)
        })
      }
    })
  },
  sum(arr) {
    var a = 0;
    for(var i = 0; i<arr.length;i++){
      a += arr[i];
    }
    return a;
  },
  // 获取每个月的天数
  getMonthDays() {
    var day_count = [];
    for(var i = 1; i<=12; i++) {
      day_count.push(util.getCountDays(i))
    }
    return day_count;
  },
  getMothElectro(info) {
    var self = this;
    var days_count = self.getMonthDays();
    var month = self.data.date[1];
    var outcome = Array(days_count[month-1]).fill(0),
      income = Array(days_count[month-1]).fill(0),
      balance = Array(days_count[month-1]).fill(0);
    if(info) {
      info.forEach(e => {
        e.time = parseInt(e.time.match(/月(\S*)日/)[1]) - 1;
        outcome[e.time] = e.outcome;
        income[e.time] = e.income;
        balance[e.time] = e.income - e.outcome;
      })
    }

    self.setData ({
      allIncome: self.sum(income),
      allOutcome: self.sum(outcome),
      allBalance: self.sum(balance),
    })
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    var days = ["01", "02", "03", "04", "05", "06", " 07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    var cur_days = days.slice(0, days_count[month-1]),
     simulationData = income;
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: cur_days,
      title: [{
        name: 'hhh'
      }],
      animation: false,
      series: [{
        name: '收入',
        data: income,
        color: "#A0E880",
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }, {
        name: '支出',
          data: outcome,
        color: "#F95353",
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      },{
          name: '结余',
          data: balance,
          color: "#FAC776",
          format: function (val, name) {
            return val.toFixed(2) + '元';
          }
        }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 300,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  // 选择时间
  bindDateChange(e) {
    var time = e.detail.value.split("-");
    var datestamp = [util.changeTime(time, false), util.changeTime(time, true)]
    this.setData({
      date: time,
      datestamp: datestamp,
      // bills: [],
    })
    app.globalData.count_date = time;
    this.getBills(app.globalData.openId, app.globalData.cur_bookid);
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
    var bookid = app.globalData.cur_bookid;
    if(app.globalData.countFlag || bookid != this.data.bookid) {
      console.log("count")
      this.setData({
        bookid: bookid,
        // bills: []
      })
      app.globalData.countFlag = false;
      this.getBills(app.globalData.userinfo._openid, bookid)
    }
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