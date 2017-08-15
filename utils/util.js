
// 格式化日期
// 返回：20170815203900
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取文件后缀名
const getSuffix = path => {
  const index1 = path.lastIndexOf(".");
  const index2 = path.length;
  return path.substring(index1, index2);
}

module.exports = {
  formatTime: formatTime,
  getSuffix: getSuffix
}
