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
    list.map()
  } catch (error) {
    next(err)
  }
});



