// pages/index/index.js
const app = getApp();
const util = require('../../utils/dateUtil.js');
const maxRight = 230;
const env = app.globalData.env;
const db = wx.cloud.database({ env: env });
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    openId: 0,
    maskHeight: 1260,
    scrollHeight: 1170,
    bills: [], //账单
    books: [], //账本
    cur_book: {}, //默认账本
    cur_edit: {}, //当前编辑账本名称
    showBooks: false, //显示所有账本
    showModalput: false, 
    index: -1,
    beIndex: -1,
    billIndex: -1,
    billsIndex: -1,
    rename: "",
    delBook: {},
    editFlag: false,
    billsFlag: false,
    showAdd: true,
    hasCon: true,
    billsPageIndex: 0, //账单加载当前页
    billsPull: true, //账单加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getWindowHeight();
    this.setData({
      openId: app.globalData.userinfo._openid,
      statusBarHeight: app.globalData.statusBarHeight,
      addHeight: app.globalData.statusBarHeight + 88 + 60 + 50
    })
    this.getBooks();
  },
  // 获取屏幕高度
  getWindowHeight() {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientWidth = res.windowWidth;
        let clientHeight = res.windowHeight;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        self.setData({
          maskHeight: height - 80,
          scrollHeight: height - self.data.statusBarHeight - 88 - 242 - 20 - 40,
        })
      }
    })
  },
  // 获取所有账本
  getBooks() {
    var self = this;
    db.collection('books').where({ _openid: self.data.openId }).get({
      success(res) {
        var info = res.data;
        info.forEach(e => {
          if (e.is_default == 1) {
            self.setData({
              cur_book: e,
            })
          }
        })
        self.setData({
          books: info
        })
        self.getBills();
      }
    })
  },
  // 获取账本账单
  getBills() {
    var self = this;
    var i = self.data.billsPageIndex;
    db.collection('bills').where({ _openid: this.data.openId, bookid: this.data.cur_book._id }).orderBy('time', 'desc').skip(20*i).get({
      success(res) {
        var arr = res.data;
        var len = arr.length;

        if(len){
          let newArr = [];
          arr.forEach((a, i) => {
            a.time = util.formatDate(a.time).split(' ')[0];
            let index = -1;
            let alreadyExsists = newArr.some((nA, j) => {
              if (a.time == nA.date) {
                index = j;
                return true;
              }
            });
            if (!alreadyExsists) {
              newArr.push({
                date: a.time,
                income: a.type ? parseInt(a.money) : 0,
                outcome: a.type ? 0 : parseInt(a.money),
                bill: [a]
              });
            } else {
              if (a.type) {
                newArr[index].income += parseInt(a.money)
              } else {
                newArr[index].outcome += parseInt(a.money)
              }
              newArr[index].bill.push(a)
            }
          });
          // newArr.forEach(e => {
          //   e.date = e.date.substr(5, 11)
          // })
          if (self.data.billsPageIndex){
            var arr = self.data.bills.concat(newArr);
            self.setData({
              hasCon: true,
              bills: arr
            })
          }else {
            self.setData({
              hasCon: true,
              bills: newArr
            })
          }
        }else {
          self.setData({
            hasCon: false
          })
        }
        if (len < 20) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '没有数据了~'
          // })
          self.setData({
            billsPull: false
          })
        }
      }
    })
  },
  // 显示所有账本
  toShowBooks() {
    this.setData ({
      showBooks: !this.data.showBooks
    })
  },
  // 选择账本
  selBook(e) {
    var self = this;
    db.collection('books').doc(self.data.cur_book._id).update({
      data: {
        is_default: 0
      },
      success(res) {
        var cur_book = e.currentTarget.dataset.item;
        db.collection('books').doc(cur_book._id).update({
          data: {
            is_default: 1
          },
          success(res) {
            self.setData({
              cur_book: cur_book,
              showBooks: !self.data.showBooks
            })
            self.getBooks();
          }
        })
      }
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
    var info = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '确定删除账本吗',
      success(res) {
        if (res.confirm) {
          db.collection('books').doc(info._id).remove({
            success: res=> {
              wx.showToast({
                icon: 'success',
                title: '删除成功！'
              })
              self.setData ({
                beIndex: -1
              })
              self.getBooks(); 
            }
          });
        }
      }
    })
  },
  // 重命名
  toRename(e) {
    var info = e.currentTarget.dataset.item;
    this.setData({
      rename: info.bookname,
      showModalput: true,
      editFlag: true,
      cur_edit: info
    })
  },
 rename() {
    var self = this;
    db.collection('books').doc(self.data.cur_edit._id).update({
      data: {
        bookname: self.data.rename
      },
      success(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
        self.getBooks();
      }
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
    var param = {
      bookname: self.data.rename,
      is_default: 0,
      create_time: util.getTime(),
      identity: 0,
    }
    db.collection('books').add({
      data: param,
      success: res => {
        self.setData({
          rename: "",
        })
        self.getBooks();
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '账本添加失败'
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
    if(!this.data.rename){
      wx.showToast({
        icon: 'none',
        title: '不能为空！'
      })
      return;
    }
    if(this.data.editFlag) {
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
  touchStartBills(e){
    this.setData ({
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
  toDelBill(e) {
    var self = this;
    var info = e.currentTarget.dataset.item;
    wx.showModal({
      title: '提示',
      content: '确定删除该记录吗',
      success(res) {
        if (res.confirm) {
          db.collection('bills').doc(info._id).remove({
            success: res => {
              wx.showToast({
                icon: 'success',
                title: '删除成功！'
              })
              self.setData ({
                billsIndex: -1
              })
              self.getBills();
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            icon: 'none',
            title: '账本删除失败'
          })
        }
      }
    })
  },
  bindScroll(e) {
    var y = e.detail.scrollTop;
    // if()
    // this.setData({
    //   be_y: y
    // })
    // console.log(y)

  },
  toAddBill() {
    wx.navigateTo({
      url: `./addBill/addBill?bookid=${this.data.cur_book._id}`
    })
  },
  // 账单下拉加载
  loadMore() {
    if (this.data.billsPull) {
      var index = this.data.billsPageIndex;
      index++;
      if (this.data.billsPull) {
        this.setData({
          billsPageIndex: index
        })
      }
      this.getBooks();
    }
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
    this.getBooks();
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