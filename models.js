const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  log: [{
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: Date,
  }]
});


exports.User = mongoose.model('User', userSchema);