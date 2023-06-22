const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, unique: true },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  finishedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  currentBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  clubPic: { type: String, default: '/Public/images/clubDefault.jpg' },
  desc: { type: String},
  nextBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  mod: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at    : { type: Date, required: true, default: Date.now },
  
  

});


module.exports = mongoose.model("Club", clubSchema); 
