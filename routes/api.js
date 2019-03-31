const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Service = require('../models/Service');
const Bid = require('../models/Bid');
const { isLoggedIn } = require('../helpers/middlewares');

router.post('/auction/create', isLoggedIn(), async (req, res, next) => {
  const owner = req.session.currentUser._id;
  const {name, description, image, StartingPrice, EndingTime, status}= req.body;
  const newAuction = {owner, name, description, image, StartingPrice, EndingTime, status};
  try {
    const prueba= await Service.create(newAuction);
    const service = await prueba._id;
    const price = StartingPrice;
    const buyer = owner;
    const newBid = {service, buyer, price};
    await Bid.create(newBid);
    res.status(200).json({message: "auction created", data: newAuction})
  } catch (err) {
    next(err)
  }
});

router.get('/user/me', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const profile = await User.findById(id)
    return res.status(200).json(profile);
  }
  catch (err) {
    next(err);
  }
});

router.put('/user/:id/edit', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { username, image, mobile, location} = req.body;
  const user = {
    username, image, mobile, location
  }; 
  try {
    const editedUser = await User.findByIdAndUpdate(id,user)
    res.status(200).json({message: "Profile updated", data : editedUser});
  }
  catch (err){
    next(err);
  }
});

router.get('/auctions/me', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().populate('service').populate('buyer');
    const list = all.filter((e) => {
      return e.service.owner.equals(id) && e.service.status === true
    })
    res.status(200).json({message:'Auctions list returned', data:list});
  } catch (err) {
    next(err)
  }
});

router.get('/auctions/me/finsihed', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().populate('service').populate('buyer');
    const list = all.filter((e) => {
      return e.service.owner.equals(id) && e.service.status === false
    })
    res.status(200).json({message:'Auctions list returned', data:list});
  } catch (err) {
    next(err)
  }
});

router.get('/auctions', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const list = await Bid.find({buyer: {$ne: id}}).populate('service').populate('buyer');
    res.status(200).json({message:'Auctions list returned', data:list});
  } catch (err) {
    next(err)
  }
});

router.get('/auction/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try { 
    const auction = await Bid.find({service: {$eq: id}}).sort({price:-1}).limit(1).populate('service').populate('buyer');
    res.status(200).json({message:'Auction detail', data: auction})
  } catch (err) {
    next(err);
  }
});

router.delete('/auction/:id', isLoggedIn(), async (req, res, next) => {
  const {id} = req.params
  try {
    await Service.findByIdAndDelete(id);
    await Bid.deleteMany({service: {$eq: id}});
    res.status(200).json({message:'Auction deleted'})
  } catch (err) {
    next(err)
  }
});

module.exports = router;