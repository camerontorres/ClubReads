const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date},
    description: { type: String },
    eventFor: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' ,  required: true}

});


module.exports = mongoose.model("Calendar", calendarSchema); 