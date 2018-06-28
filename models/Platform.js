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
  consoleArt: {
    type: String
  },
  controlleArt: {
    type: String
  },
  images: {
    type: [String]
  }
}, {
  collection: 'platforms'
});

Platform.pre('save', next => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
    this.updatedAt = now;
  }
  next();
});

Platform.pre('findOneAndUpdate', next => {
  this.findOneAndUpdate({}, { $set: { updatedAt: new Date() } });
  next();
});

Platform.statics.process = function process(response) {
  return {
    remoteId: response.id ? response.id : null,
    name: response.name ? response.name : null,
    controller: response.controller ? response.controller : null,
    overview: response.overview ? response.overview : null,
    developer: response.developer ? response.developer : null,
    manufacturer: response.manufacturer ? response.manufacturer : null,
    cpu: response.cpu ? response.cpu : null,
    memory: response.memory ? response.memory : null,
    graphics: response.graphics ? response.graphics : null,
    sound: response.sound ? response.sound : null,
    display: response.display ? response.display : null,
    media: response.media ? response.media : null,
    maxControllers: response.maxControllers ? response.maxControllers : null,
    rating: response.rating ? response.rating : null,
    consoleArt: response.images && response.images.find(x => x.type === 'consoleart') && response.images.find(x => x.type === 'consoleart').url ?
      response.images.find(x => x.type === 'consoleart').url : null,
    controllerArt: response.images && response.images.find(x => x.type === 'controllerart') && response.images.find(x => x.type === 'controllerart').url ?
      response.images.find(x => x.type === 'controllerart').url : null,
    images: response.images && response.images.filter(x => x.type !== 'consoleart' && x.type !== 'controllerart')
    && response.images.filter(x => x.type !== 'consoleart' && x.type !== 'controllerart').map(x => x.url) ?
      response.images.filter(x => x.type !== 'consoleart' && x.type !== 'controllerart').map(x => x.url) : null
  };
};

module.exports = mongoose.model('Platform', Platform);
