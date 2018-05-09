var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;


var User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        default: false
    },
    admin: {
      type: Boolean,
      required: true
    }
}, {
    collection: 'users'
});

User.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

User.statics.authenticate = function (login, password, callback) {
    console.log(login)
    this.findOne({$or:[{email: login}, {user: login}]}).exec(function (err, user) {
        console.log(user)
        if (err) {
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
  }

module.exports = mongoose.model('User', User);

