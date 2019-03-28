const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const serviceSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  StartingPrice: {
    type: Number,
    required: false
  },
  EndingTime: {
    type: Date,
    required: false
  },
  status: {
    type: Boolean,
    required: true,
    default: true
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
