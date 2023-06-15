const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String},
  num_pages: {type: String},
  editions: {type: String},
  
  cover_image: { type: String, default: 'coverDefault.jpg' },
  
  
});


module.exports = mongoose.model("Book", bookSchema); 