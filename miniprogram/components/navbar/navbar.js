// components/navbar/navbar.js
const app = getApp()
Component({
  properties: {
    innerTitle: {   
      type: String,
      value: '记账账单'
    },
    isShowBack: {
      type: String,
      value: "true"
    }
  },
  data: {
    statusBarHeight: '',
  },
  attached: function () {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight 
    })
  },
  methods: {
    _navback() {
      wx.navigateBack()
    },
  }
}) 
