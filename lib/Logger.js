module.exports.log = function(text) {
  var date = new Date();
  
  var year = date.getFullYear().toString(), 
      month = pad(date.getMonth() + 1, 2),
      day = pad(date.getDay() + 1, 2), 
      hour = pad(date.getHours() + 1, 2), 
      minute = pad(date.getMinutes(), 2),
      second = pad(date.getSeconds(), 2);
  
  var date_string = year + '-' +
                    month + '-' +
                    day + '-' +
                    hour + ':' +
                    minute + ':' +
                    second;
  process.stdout.write('[' + date_string + '] ' + text + '\n');
};

var pad = function(number, length) {
  if (number.toString().length >= length) {
    return number.toString();
  } else {
    return pad('0' + number.toString(), length);
  }
};