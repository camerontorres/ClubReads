const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: [String], required: true },
    author: [{ type: String }],
  url: { type: String},
  num_pages: {type: String},
  editions: {type: String},
  startDate: { type: Date},
  finishDate: { type: Date},

  
  cover_image: { type: String, default: '/Public/images/coverDefault.jpg' },
  
  
});


module.exports = mongoose.model("Book", bookSchema); 