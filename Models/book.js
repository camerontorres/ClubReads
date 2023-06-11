const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String},
  
  coverPic: { type: String, default: 'coverDefault.jpg' },
  
  
  

});


module.exports = mongoose.model("Book", bookSchema); 