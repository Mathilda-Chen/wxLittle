// pages/index/index.js
const app = getApp();
const util = require('../../utils/dateUtil.js');
const maxRight = 230;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    addHeight: app.globalData.statusBarHeight + 88 + 60 + 50,
    scrollTop: app.globalData.statusBarHeight + 88 + 60 + 174 + 10,
    maskHeight: 0,
    scrollHeight: 0,
    bills: [], //账单
    books: [], //账本
    cur_book: {}, //默认账本
    cur_edit: {}, //当前编辑账本
    delBook: {}, //当前删除账本
    showBooks: false, //显示所有账本
    showModalput: false,
    index: -1, 
    beIndex: -1,
    billIndex: -1,
    billsIndex: -1,
    rename: "",
    editFlag: false,
    billsFlag: false,
    showAdd: true,
    hasCon: true,
    hasBook: true,
    noScroll: true,
    addInfo: false,
    billsPageIndex: 0, //账单加载当前页
    billsPull: true, //账单加载
    pick_date: app.globalData.cur_time,
    date: app.globalData.cur_time,
    datestamp: app.globalData.cur_timestamp,
    allIncome: 0,
    allOutcome: 0,
    allBalance: 0,
    countInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight * app.globalData.ratio;
        self.setData({
          maskHeight: clientHeight,
          scrollHeight: clientHeight - app.globalData.statusBarHeight - 88 - 60 - 174 - 10 - 20 ,
        })
      }
    })   
    this.getBooks(app.globalData.openId, false);
  },
  // 获取所有账本
  getBooks(openId, onlyBooks) {
    var self = this;
    app.searchData('books', { _openid: openId }, "", 0, res => {
      var info = res.data;
      if(!info.length) {
        self.setData({
          hasBook: false
        })
        return;
      }
      info.forEach(e => {
        if (e.is_default) {
          self.setData ({
            cur_book: e
          })
          app.globalData.cur_bookid = e._id;
        }
      })
      self.setData ({
        books: info
      })
      if(!onlyBooks) {
        self.getcount(openId, app.globalData.cur_bookid);
        self.getBills(openId, app.globalData.cur_bookid);
      }

    })
  },
  // 获取账本账单
  getBills(openId, bookid) {
    if(!app.globalData.cur_bookid) {
      this.setData({
        hasBook: false
      })
      return;
    }
    var self = this;
    var i = this.data.billsPageIndex;
    var param = {
      _openid: openId, 
      bookid: bookid, 
    }
    app.searchData('bills', param, self.data.datestamp, i, res => {
      var arr = res.data;
      var len = arr.length;
      // 没有数据则返回
      if (!len && i == 0) {
        self.setData({
          hasCon: false
        })
        return;
      }
      if (len < 20) {
        self.setData({
          billsPull: false
        })
      }
      if (self.data.bills.length) {
        arr = self.data.bills.concat(arr);
      }
      var newArr = app.formatData(arr);
      self.setData({
        hasCon: true,
        bills: newArr,
      })
    })
  },
  // 显示所有账本
  toShowBooks() {
    if(!app.globalData.cur_bookid) {
      this.toAddBook();
    }else {
      this.setData({
        showBooks: !this.data.showBooks
      })
    }
  },
  // 选择账本
  selBook(e) {
    var self = this;
    app.editData('books', self.data.cur_book._id, { is_default: 0 }, res => {
      var cur_book = e.currentTarget.dataset.item;
      app.editData('books', cur_book._id, { is_default: 1 }, res => {
        self.setData({
          cur_book: cur_book,
          showBooks: !self.data.showBooks,
          billsPageIndex: 0,
          hasCon: true,
          billsPull: true,
          bills: [],
          countInfo: [],
          allIncome: 0,
          allOutcome: 0,
          allBalance: 0,
          date: app.globalData.cur_time,
          datestamp: app.globalData.cur_timestamp,
        })
        app.globalData.cur_bookid = cur_book._id;
        self.getBooks(app.globalData.openId, false);
      })
    })
  },
  // 左滑操作
  touchStart(e) {
    var index = e.currentTarget.dataset.index;
    var beIndex = this.data.beIndex;

    if (index != beIndex && beIndex != -1) {
      var list = this.data.books;
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
    var list = this.data.books;
    list[this.data.index].right = right;
    this.setData({
      books: list
    })
  },
  touchEnd(e) {
    var endX = e.changedTouches[0].clientX;
    var disX = this.data.startX - endX;
    var right = disX > maxRight / 2 ? maxRight : 0;
    var list = this.data.books;
    list[this.data.index].right = right;
    this.setData({
      books: list,
    })
  },
  // 删除
  toDel(e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var info = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '确定删除账本吗？',
      success(res) {
        if (res.confirm) {
          app.delData('books', info._id, res => {
            app.getCloud('delBook', {bookid: info._id}, res => {})
            wx.showToast({
              icon: 'success',
              title: '删除成功！'
            })
            self.data.books.splice(index, 1);
            if (info.is_default && self.data.books.length) { // 此账本为默认账本
              var id = self.data.books[0]._id;
              app.editData('books', id, { is_default: 1 }, res => {
                self.getBooks(app.globalData.openId, false);
                self.setData({
                  bills: []
                })
              })
            } else if (!self.data.books.length){
              self.setData({
                books: [],
                bills: [],
                countInfo: [],
                allIncome: 0,
                allOutcome: 0,
                allBalance: 0,
                showBooks: false,
                hasBook: false,
                hasCon: false,
                cur_book: {},
              })
              app.globalData.cur_bookid = 0;
            }else{
              self.setData({
                books: self.data.books
              })
            }
            self.setData({
              beIndex: -1,
            })
          })
        }
      }
    })
  },
  // 重命名
  toRename(e) {
    var index = e.currentTarget.dataset.index;
    var info = e.currentTarget.dataset.item;
    this.setData({
      rename_index: index,
      rename: info.bookname,
      showModalput: true,
      editFlag: true,
      cur_edit: info
    })
  },
  rename() {
    var self = this;
    app.editData('books', self.data.cur_edit._id, { bookname: self.data.rename}, res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
      })
      var index = self.data.rename_index;
      self.setData ({
        [`books[${index}].bookname`]: self.data.rename
      })
    })
  },
  // 新建账本
  toAddBook(e) {
    this.setData({
      showModalput: true,
      rename: "",
      editFlag: false,
    })
  },
  addBook() {
    var self = this;
    app.countData('books', { _openid: app.globalData.openId, bookname: self.data.rename }, "", res => {
      if(res.total != 0) {
        wx.showToast({
          title: '已存在！',
          icon: 'none',
        })
      }else {
        var is_default = app.globalData.cur_bookid ? 0 : 1;
        var param = {
          bookname: self.data.rename,
          is_default: is_default,
          create_time: util.getTime(),
          identity: 0,
        }
        app.addData('books', param, res => {
          self.setData({
            rename: "",
            hasBook: true
          })
          wx.showToast({
            title: '添加成功',
            icon: 'success',
          })
          if (is_default) {
            self.getBooks(app.globalData.openId, false)
          }else {
            self.getBooks(app.globalData.openId, true)
          }
        })
      }
    })
  },
  // 弹出输入框
  inputConfirm(e) {
    this.setData({
      rename: e.detail.value
    })
  },
  confirm() {
    if (!this.data.rename) {
      wx.showToast({
        icon: 'none',
        title: '不能为空！'
      })
      return;
    }
    if (this.data.editFlag) {
      this.rename();
    } else {
      this.addBook();
    }
    this.setData({
      showModalput: false,
    })
  },
  cancel: function () {
    this.setData({
      showModalput: false,
      rename: ""
    });
  },
  // 账单操作
  // 左滑操作
  touchStartBills(e) {
    this.setData({
      noScroll: true,
      billsIndex: e.currentTarget.dataset.index
    })
  },
  touchStartBill(e) {
    var index = e.currentTarget.dataset.index;
    var billIndex = this.data.billIndex;
    if (index != billIndex && billIndex != -1) {
      var list = this.data.bills;
      list[this.data.billsIndex].bill[this.data.billIndex].right = 0;
    }
    this.setData({
      noScroll: true,
      startX: e.touches[0].clientX,
      billIndex: index,
      index: index
    })
  },
  touchMoveBill(e) {
    var moveX = e.touches[0].clientX;
    var disX = this.data.startX - moveX;
    var right = 0;
    if (disX == 0 || disX < 0) {
      right = 0;
    } else if (disX > 0) {
      right = disX > maxRight ? maxRight : disX;
    }
    var list = this.data.bills;
    list[this.data.billsIndex].bill[this.data.billIndex].right = right;
    this.setData({
      bills: list
    })
  },
  touchEndBill(e) {
    var endX = e.changedTouches[0].clientX;
    var disX = this.data.startX - endX;
    var right = disX > maxRight / 2 ? maxRight : 0;
    var list = this.data.bills;
    list[this.data.billsIndex].bill[this.data.billIndex].right = right;
    if(right == maxRight) {
      this.setData({
        noScroll: false,
      })   
    }
    this.setData({
      bills: list,
    })
  },
  // 编辑
  toEdit(e) {
    var info = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `./addBill/addBill?bill=${info}`
    })
  },
  // 删除账单
  toDelBill(e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var info = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '确定删除该记录吗？',
      success(res) {
        if (res.confirm) {
          app.delData('bills', info._id, res => {
            wx.showToast({
              icon: 'success',
              title: '删除成功！'
            })
            self.setData({
              billIndex: -1,
              billsIndex: -1,
              billsPageIndex: 0,
              hasCon: true,
              billsPull: true,
              bills: [],
              countInfo: [],
              addInfo: false
            })
            var count_date = app.globalData.count_date;
            var del_date = self.data.date;
            if (count_date[0] == del_date[0] && count_date[1] == del_date[1]) {
              app.globalData.countFlag = true;
            }
            self.getBooks(app.globalData.openId, false);
          })
        }
      }
    })
  },
  bindScroll(e) {
    this.setData({
      noScroll: false
    })
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => { 
      this.setData({
        noScroll: true
      })
    }, 150)
  },
  // 添加账单
  toAddBill() {
    this.setData ({
      indexPage: false
    })
    wx.navigateTo({
      url: `./addBill/addBill`
    })
  },
  // 选择时间
  bindDateChange(e) {
    var time = e.detail.value.split("-");
    var datestamp = [util.changeTime(time, false), util.changeTime(time, true)];
    this.setData ({
      date: time,
      datestamp: datestamp,
      billsPageIndex: 0,
      billIndex: -1,
      billsIndex: -1,
      hasCon: true,
      billsPull: true,
      bills: [],
      countInfo: []
    })
    app.globalData.index_date = time;
    this.getcount(app.globalData.openId, app.globalData.cur_bookid);
    this.getBills(app.globalData.openId, app.globalData.cur_bookid);
  },
  // 账单下拉加载
  loadMore() {
    if (this.data.billsPull) {
      var index = this.data.billsPageIndex;
      index++;
      if (this.data.billsPull) {
        this.setData({
          billIndex: -1,
          billsIndex: -1,
          billsPageIndex: index
        })
      }
      this.getBills(app.globalData.openId, app.globalData.cur_bookid);
    }
  },
  sum(arr) {
    var a = 0;
    for (var i = 0; i < arr.length; i++) {
      a += arr[i];
    }
    return a;
  },
  // 获取总数量
  getcount(openId, bookid) {
    var self = this;
    if (!bookid) {
      this.getMothElectro();
      return;
    }
    app.countData('bills', { _openid: openId, bookid: bookid }, self.data.datestamp, res => {
      var total = res.total;
      if (!total) {
        self.getMothElectro();
        return;
      }
      var times = Math.ceil(total / 20);
      var info = [];
      var i ;
      for (i = 0; i < times; i++) {
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
          if(i == times) {
            self.getMothElectro(info);
          }
        })
      }
    })
  },
  sum(arr) {
    var a = 0;
    for (var i = 0; i < arr.length; i++) {
      a += arr[i];
    }
    return a;
  },
  getMothElectro(info) {
    var self = this;
    var allIncome = 0,
      allOutcome = 0,
      allBalance = 0;
    if(info) {
      info.forEach(e => {
        allIncome += e.income;
        allOutcome += e.outcome;
      })
    }
    self.setData({
      allIncome: allIncome,
      allOutcome: allOutcome,
      allBalance: allIncome - allOutcome,
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
    if (app.globalData.indexFlag){
      console.log('index')
      this.setData({
        billsPageIndex: 0,
        bills: [],
        countInfo: [],
        hasCon: true,
        billsPull: true,
        billIndex: -1,
        billsIndex: -1,
        addInfo: false
      })
      app.globalData.indexFlag = false;
      this.getBooks(app.globalData.openId, false);
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