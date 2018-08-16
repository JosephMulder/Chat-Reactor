let bcrypt = require('bcryptjs');

module.exports = function(pwStr,cb){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(pwStr, salt, function(err, hash) {
      cb(null,hash,salt)
    })
  })
};