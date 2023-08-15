const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    description: { type: String },
  
  
});


module.exports = mongoose.model("Calendar", calendarSchema); 