const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;