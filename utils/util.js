const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//格式, 2017-12-08,15:14:20
var formatTime2 = function(datestring) {
  if (datestring != 'undefined' && datestring != '') {
    var dateAndTime = datestring.split("T");
    var datestr = dateAndTime[0];
    var timestr = dateAndTime[1].split(":");
    var hours = parseInt(timestr[0]) + 8;
    var seconds = timestr[2].substring(0,2);
    var newStr = datestr + "," + hours + ":" + timestr[1] + ":" + seconds;
    return newStr;
  } else {
    return "";
  }
}

/**
 * 拓展对象
 */
var extend = function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}


module.exports = {
  formatTime: formatTime,
  extend: extend,
  formatTime2: formatTime2
}
