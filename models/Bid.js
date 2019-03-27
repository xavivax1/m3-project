const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
  service: {
    type: ObjectId,
    ref: 'Service'
  },
  buyer: {
    type: ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true
  },
  SellerRating: {
    type: Number,
    required: false
  },
  BuyerRating: {
    type: Number,
    required: false
  },
  BidDate: {
    type: Date,
    required: false
  }
});

const Bid = mongoose.model('Bid', BidSchema);

module.exports = Bid;
