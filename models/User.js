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

User.pre('save', function preSave(next) {
  const user = this;
  const now = new Date();
  if (!user.createdAt) {
    user.createdAt = now;
    user.updatedAt = now;
  }
  bcrypt.hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      return next();
    })
    .catch(error => next(error));
});

User.pre('findOneAndUpdate', function preUpdate(next) {
  this._update.updatedAt = new Date(); // eslint-disable-line no-underscore-dangle
  if (this._update.password) { // eslint-disable-line no-underscore-dangle
    this._update.password = bcrypt // eslint-disable-line no-underscore-dangle
      .hashSync(this._update.password, 10); // eslint-disable-line no-underscore-dangle
  }
  next();
});

User.methods.toDTO = function toDTO() {
  return {
    id: this.id,
    email: this.email,
    user: this.user,
    admin: this.admin
  };
};

User.statics.authenticate = function authenticate(login, password, callback) {
  this.findOne({ $or: [{ email: login }, { user: login }] })
    .then(user => {
      if (!user) {
        const notFoundError = new Error('User not found.');
        return callback(notFoundError);
      }
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result === true) {
            return callback(null, user.toDTO());
          }
          return callback();
        });
      return null;
    })
    .catch(error => callback(error));
};

module.exports = mongoose.model('User', User);

