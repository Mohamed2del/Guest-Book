const moment = require('moment')
module.exports = {
    dateFormat: function (date, format) {
      return moment(date).utc().format(format)
    },
    editButtton: function (postUser, loggedUser, postId) {
      if (postUser.toString() == loggedUser._id.toString()) {
        
          return `<a href="/posts/edit/${postId}" class="card-link">Edit</a>`
        
      } else {
        return `<a href="/posts/edit/${postId}" class="card-link">dsadasdasdas</a>`
      }}
}

