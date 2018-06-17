const mongoose = require('mongoose');

const { Schema } = mongoose;

const Rom = new Schema({
  remoteId: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String
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
  esbr: {
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
