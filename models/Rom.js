var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rom = new Schema({
    title: {
        type: String
    },
    console: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'roms'
});

module.exports = mongoose.model('Rom', Rom);