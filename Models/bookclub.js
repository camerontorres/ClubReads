const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  finishedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  currentBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  clubPic: { type: String, default: 'clubDefault.jpg' },
  desc: { type: String},
  nextBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  
  

});


module.exports = mongoose.model("Club", clubSchema); 
