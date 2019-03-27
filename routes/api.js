const express = require('express');
const router = express.Router();


const User = require('../models/User');
const Service = require('../models/Service');
const Bid = require('../models/bid');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');



router.get('user/me', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const user = user.findById(id)
    return res.status(200).json(user);
  }
  catch (err) {
    next(err);
  }
});

router.put('user/:id/edit', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { username, password, image, mobile, location} = req.body;

  if (!username || !password ) {
    res.status(400).json({message: "Necessary username and password"});
    return;
  }
  const user = {
    username, password, image, mobile, location
  }; 
  try {
    const editedUser = await user.findByIdAndUpdate(id,user)
    res.status(200).json({message: "Profile updated", data : editedUser});

  }
  catch (err){
    next(err);
  }
});

router.get('auctions', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const list = await Service.find();
    const othersList = list.filter(owner === !id);
    res.status(200).json({message:'Auctions list returned', data:othersList});
  } catch (err) {
    next(err)
  }
});

router.get('auctions/me', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const list = await Service.find({owner: id});
    res.status(200).json({message:'Auctions list returned', data:list});
  } catch (err) {
    next(err)
  }
});

router.get('auction/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.param;
  try {
    const auction = await Service.findById(id);
    res.status(200).json({message:'Auction detail', data:auction})
  } catch (err) {
    next(err);
  }
});

router.post('auction/create', isLoggedIn(), async (req, res, next) => {
  const owner = req.session.currentUser._id;
  const {name, description, image, StartingPrice, EndingTime, status}
  const newAuction = {owner, name, description, image, StartingPrice, EndingTime, status}
  
  try {
    await Service.create(newAuction);
  } catch (err) {
    next(err)
  }
});

router.delete('auction/:id', isLoggedIn(), async (req, res, next) => {
  const {id} = req.params

  try {
    await Service.findByIdAndDelete(id);
    res.status(200).json({message:'Auction deleted'})
  } catch (err) {
    next(err)
  }
});



