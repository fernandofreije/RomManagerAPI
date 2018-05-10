const mongoose = require('mongoose');

const { Schema } = mongoose;

const Rom = new Schema({
  title: {
    type: String,
    required: true
  },
  art: {
    type: String
  },
  trailer: {
    type: String
  },
  release_date: {
    type: Date
  },
  publisher: {
    type: String
  },
  developer: {
    type: String
  },
  genres: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
  },
  platform: {
    type: Schema.Types.ObjectId,
    ref: 'Platform'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: {
    type: Schema.Types.ObjectId
  }
}, {
  collection: 'roms'
});

module.exports = mongoose.model('Rom', Rom);
