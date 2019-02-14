// components/calendar/calendar.js

Component ({
  behaviors: [],
  properties: {



  },
  data: {
    year: [],
    month: ["01", "02", "03", "04", "05", "06", " 07", "08", "09", "10", "11", "12"],
    yearIndex: 0,
    monthIndex: 0,
    cur_year: 2018,
    isShow: false    
  },
  lifetimes: {
    attached() {
      const date = new Date();
      var cur_year = date.getFullYear();
      var yearArr = [];
      var monthIndex;
      for (var i = 2016; i <= cur_year; i++) {
        yearArr.push(i);
      }
      this.data.month.forEach(function(v, i) {
        if (v == (date.getMonth() + 1)){
          monthIndex = i;
          return;
        }
      })
      this.setData({
        cur_year: cur_year,
        year: yearArr,
        yearIndex: yearArr.length-1,
        monthIndex: monthIndex
      })
    },
    moved() { },
    detached() { },
  },
  // pageLifetimes: {
  //   // 组件所在页面的生命周期函数
  //   show() { },
  //   hide() { },
  //   resize() { },
  // },

  methods: {
    // 隐藏弹框
    hideCalendar() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    // 展示弹框
    showCalendar() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    _reventTouchMove() { },
    _yearUp() {
      let index = this.data.yearIndex;
      index--;
      this.setData({
        yearIndex: index
      })
    },
    _yearDown() {
      let index = this.data.yearIndex;
      index++;
      this.setData({
        yearIndex: index
      })
    },
    _monthUp() {
      let index = this.data.monthIndex;
      index--;
      this.setData({
        monthIndex: index
      })
    },
    _monthDown() {
      let index = this.data.monthIndex;
      index++;
      this.setData({
        monthIndex: index
      })
    },
    _cancelEvent() {
      // 触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      var year = this.data.year[this.data.yearIndex];
      var month = this.data.month[this.data.monthIndex];
      // 触发成功回调
      this.triggerEvent("confirmEvent", {year, month})
    }
  }
})