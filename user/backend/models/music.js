const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  movie: String,
  fileUrl: String,
  coverImage: String,
});

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
