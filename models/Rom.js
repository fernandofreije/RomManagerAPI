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
  boxartFront: {
    type: String
  },
  boxartBack: {
    type: String
  },
  clearLogo: {
    type: String
  },
  screenshots: {
    type: [String]
  },
  images: {
    type: [String]
  },
  trailer: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  publisher: {
    type: String
  },
  developer: {
    type: String
  },
  ESRB: {
    type: String
  },
  genres: {
    type: [String]
  },
  platform: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: {
    type: String
  }
}, {
  collection: 'roms'
});

Rom.pre('save', next => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
    this.updatedAt = now;
  }
  next();
});


Rom.pre('findByIdAndUpdate', next => {
  this.findOneAndUpdate({}, { $set: { updatedAt: new Date() } });
  next();
});

Rom.methods.toDTO = function toDTO() {
  return {
    id: this.id,
    remoteId: this.remoteId,
    title: this.title,
    overview: this.overview,
    boxartFront: this.boxartFront,
    boxartBack: this.boxartBack,
    clearLogo: this.clearLogo,
    screenshots: this.screenshots,
    images: this.images,
    trailer: this.trailer,
    releaseDate: this.releaseDate,
    publisher: this.publisher,
    developer: this.developer,
    ESRB: this.ESRB,
    genres: this.genres,
    platform: this.platform,
    user: this.user,
    file: this.file
  };
};

Rom.statics.process = function process(response, userId = null) {
  const conditionBoxArtFront = (x => x.type === 'boxart' && x.side === 'front');
  const conditionBoxArtBack = (x => x.type === 'boxart' && x.side === 'back');
  const conditionClearLogo = (x => x.type === 'clearlogo');
  const conditionScreenshot = (x => x.type === 'screenshot');
  const conditionImages = (x => x.type !== 'boxart' && x.type !== 'clearlogo' && x.type !== 'screenshot');
  return {
    remoteId: response.id ? response.id : null,
    title: response.title ? response.title : null,
    overview: response.overview ? response.overview : null,
    trailer: response.youtube ? response.youtube : null,
    releaseDate: response.releaseDate ? response.releaseDate : null,
    publisher: response.publisher ? response.publisher : null,
    developer: response.developer ? response.developer : null,
    ESRB: response.ESRB ? response.ESRB : null,
    genres: response.genres ? response.genres : null,
    platform: response.platform ? response.platform : null,
    file: response.fileUrl ? response.FileUrl : null,
    user: userId,
    boxartFront: response.images && response.images.find(conditionBoxArtFront)
    && response.images.find(conditionBoxArtFront).url ?
      `http://legacy.thegamesdb.net/banners/_gameviewcache${response.images.find(conditionBoxArtFront).url}` : null,
    boxartBack: response.images && response.images.find(conditionBoxArtBack)
    && response.images.find(conditionBoxArtBack).url ?
      `http://legacy.thegamesdb.net/banners/_gameviewcache${response.images.find(conditionBoxArtBack).url}` : null,
    clearLogo: response.images && response.images.find(conditionClearLogo)
    && response.images.find(conditionClearLogo).url ?
      `http://legacy.thegamesdb.net/banners${response.images.find(conditionClearLogo).url}` : null,
    screenshots: response.images && response.images.filter(conditionScreenshot)
    && response.images.filter(conditionScreenshot).map(x => x.url) ?
      response.images.filter(conditionScreenshot).map(x => `http://legacy.thegamesdb.net/banners/_gameviewcache/${x.url}`) : null,
    images: response.images && response.images.filter(conditionImages)
    && response.images.filter(conditionImages).map(x => x.url) ?
      response.images.filter(conditionImages).map(x => `http://legacy.thegamesdb.net/banners/_gameviewcache/${x.url}`) : null
  };
};

module.exports = mongoose.model('Rom', Rom);
