const moment = require('moment')
module.exports = {
    dateFormat: function (date, format) {
      return moment(date).utc().format(format)
    }
  
}

