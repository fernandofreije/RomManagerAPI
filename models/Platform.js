const mongoose = require('mongoose');

const { Schema } = mongoose;

const Platform = new Schema({
  remoteId: {
    type: Number,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true
  },
  controller: {
    type: String
  },
  overview: {
    type: String
  },
  developer: {
    type: String
  },
  manufacturer: {
    type: String
  },
  cpu: {
    type: String
  },
  memory: {
    type: String
  },
  graphics: {
    type: String
  },
  sound: {
    type: String
  },
  display: {
    type: String
  },
  media: {
    type: String
  },
  maxControllers: {
    type: Number
  },
  rating: {
    type: Number
  },
  images: {
    type: String
  }
}, {
  collection: 'platforms'
});

module.exports = mongoose.model('Platform', Platform);
