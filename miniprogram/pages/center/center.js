// pages/center/center.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      nickName: "未登录",
      avatarUrl: "../../images/user-unlogin.png"
    },
    num: [0, 0, 0],
    diary: [
      {
        id: "woman",
        img: "../../images/DYM.png",
        txt: "DYM"
      },{
        id: "diary",
        img: "../../images/riji.png",
        txt: "日记"  
      },{
        img: "../../images/daixu.png",
        txt: "待续.."
      }
    ],
    record: [
      {
        id: "interview",
        img: "../../images/mianshi.png",
        txt: "面试"
      }, {
        id: "question",
        img: "../../images/yiwen.png",
        txt: "疑问"
      }, {
        id: "bug",
        img: "../../images/bug.png",
        txt: "bug"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login();
    this.getNum();
    // var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=6";
    // console.log(app.globalData)
  },
  login () {
    app.getCloud('login', {}, res => {
      if (!res.result.data.length) return;
      this.setData({
        user: res.result.data[0]
      })
    })
  },
  getNum () {
    app.getCloud('noteSearch', {}, res => {
      if (!res.result.data.length) return;
      this.setData({
        [`num[0]`]: res.result.data.length
      })
    })
  },
  onGotUserInfo(e) {
    if (e && e.detail.errMsg == "getUserInfo:ok") {
      this.setData ({
        user: e.detail.userInfo
      })
      app.getCloud('login', { info: this.data.user }, res => {
        console.log(res)
      })
    }
  },
  toNext (e) {
    let next = e.currentTarget.dataset.next;
    wx.navigateTo({
      url: `./${next}/${next}`,
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
    this.getNum();
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