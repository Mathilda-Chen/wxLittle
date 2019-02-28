function formatDate(timestamp) {
  let time = new Date(timestamp);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();

  month < 10 && (month = `0${month}`);
  day < 10 && (day = `0${day}`);
  hour < 10 && (hour = `0${hour}`);
  minute < 10 && (minute = `0${minute}`);
  second < 10 && (second = `0${second}`);

  return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}

// 当前具体时间
function getHour() {
  let time = new Date();
  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();
  return `${hour}:${minute}:${second}`
}


//当前时间戳
function getTime() {
  return Date.parse(new Date());
}

// 转换时间戳
// 格式 year-month-day
function changeTime(time, isAdd, spe) {
  var year = time[0];
  var month = isAdd ? parseInt(time[1])+1 : time[1];
  var day = time[2] ? time[2]: 1;
  var hour = spe ? spe : "00:00:00"
  var newTime = `${year}/${month}/${day} ${hour}`;
  var date = new Date(newTime);
  return Date.parse(date);
}

// 获取每个月的天数
function getCountDays(month) {
  var curDate = new Date();
  curDate.setMonth(month);
  curDate.setDate(0);
  return curDate.getDate();
}

module.exports = {
  formatDate, getTime, changeTime, getCountDays, getHour
}