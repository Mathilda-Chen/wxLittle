function formatDate(timestamp) {
  let time = new Date(timestamp);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();

  year < 10 && (year = `0${year}`);
  month < 10 && (month = `0${month}`);
  day < 10 && (day = `0${day}`);
  hour < 10 && (hour = `0${hour}`);
  minute < 10 && (minute = `0${minute}`);
  second < 10 && (second = `0${second}`);

  return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}

//当前时间戳
function getTime() {
  return Date.parse(new Date());
}

// 转换时间戳
function changeTime(time) {
  var date = new Date(time);
  return Date.parse(date);
}

module.exports = {
  formatDate, getTime, changeTime
}