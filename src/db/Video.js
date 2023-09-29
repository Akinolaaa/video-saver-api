const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true, 'video url missing'],
  },
  download_url: {
    type: String,
  },
}, { timestamps: true})

module.exports = mongoose.model('Video', VideoSchema)