const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const User = new Schema({
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
    default: false
  }
}, {
  collection: 'users'
});

User.pre('save', function hashPass(next) {
  const user = this;
  bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      return next();
    })
    .catch(error => next(error));
});

User.statics.authenticate = function authenticate(login, password, callback) {
  this.findOne({ $or: [{ email: login }, { user: login }] })
    .then(user => {
      if (!user) {
        const notFoundError = new Error('User not found.');
        notFoundError.status = 400;
        return callback(notFoundError);
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result === true) {
            return callback(null, user);
          }
          return callback();
        });
      return null;
    })
    .catch(error => callback(error));
};

module.exports = mongoose.model('User', User);

