//import moment from 'moment';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Service = require('../models/Service');
const Bid = require('../models/Bid');
const { isLoggedIn } = require('../helpers/middlewares');

//Funcion para retornar elementos unicos de un array de objetos
 unicos = (arr, filtrar) =>{
  var unics = [];
  return arr.filter(function(item){
    return unics.indexOf(item[filtrar]) < 0 ? unics.push(item[filtrar]) : false
  })
}
// maintenance
router.get('/maintenance', isLoggedIn(), async (req, res, next) => {

  const fecha = new Date();  
  try {
    console.log(fecha);
    const res = await Service.updateMany({ 
                                          EndingTime: {"$lt": fecha},
                                           status : true },
                                          { status: false });
    // db.services.updateMany ({ EndingTime: {"$lt": "2019-04-03T08:39:18.743Z"}, status : true },{ status: false })
    console.log('updated:'+ res.nModified);
  }
  catch (err) {
    console.log(err)
    next(err);
  }
});
//Recibir información del perfil
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

//Editar perfil
router.put('/user/:id/edit', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const { username, image, mobile, location } = req.body;
  const user = {
    username, image, mobile, location
  };
  try {
    const editedUser = await User.findByIdAndUpdate(id, user)
    res.status(200).json({ message: "Profile updated", data: editedUser });
  }
  catch (err) {
    next(err);
  }
});

//Crear Auction --> Creamos tambien una puja del mismo vendedor con el precio inicial, para así poder buscar por bind
router.post('/auction/create', isLoggedIn(), async (req, res, next) => {
  const owner = req.session.currentUser._id;
  const { name, description, image, StartingPrice, EndingTime, status } = req.body;
  const newAuction = { owner, name, description, image, StartingPrice, EndingTime, status };
  try {
    const prueba = await Service.create(newAuction);
    console.log(prueba)
    const service = prueba._id;
    const price = StartingPrice;
    const buyer = owner;
    const newBid = { service, buyer, price };
    await Bid.create(newBid);
    res.status(200).json({ message: "auction created", data: newAuction })
  } catch (err) {
    next(err)
  }
});

//Mis servicios activos
router.get('/auctions/me', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const uniqueList = unicos(all, "service");
    const list = uniqueList.filter((e) => {
      return e.service.owner.equals(id) && e.service.status === true
    })
    
    res.status(200).json({ message: 'Auctions list returned', data: list });
  } catch (err) {
    next(err)
  }
});

//Mis servicios finalizados
router.get('/auctions/me/finished', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const uniqueList = unicos(all, "service");
    const list = uniqueList.filter((e) => {
      return e.service.owner.equals(id) && e.service.status === false
    })
    res.status(200).json({ message: 'Auctions list returned', data: list });
  } catch (err) {
    next(err)
  }
});

//Lista general de auctions
router.get('/auctions', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const prelist = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const uniqueList = unicos(prelist, "service")
    const list = uniqueList.filter((e) => {
      return e.service.owner != id && e.service.status === true 
    })
    res.status(200).json({ message: 'Auctions list returned', data: list });
  } catch (err) {
    next(err)
  }
});

//Lista general de auctions donde he pujado
router.get('/auctions/bidded', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    // const all = await Bid.find({ buyer: { $eq: id } }).sort({ price: -1 }).populate('service').populate('buyer');
    const all = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const profile = await User.findById(id)
    const user = await profile.username
    console.log(user)
    const prelist = all.filter((e) => {
      return e.service.buyers.includes(`${user}`) && e.service.status === true
    })
    const list = unicos(prelist, "service")
    res.status(200).json({ message: 'MyBidded Auctions list returned', data: list });
  } catch (err) {
    next(err)
  }
});

//Lista de auctions finalizadas donde he pujado y he perdido
router.get('/auctions/bidded/finished', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const profile = await User.findById(id)
    const user = await profile.username
    const prelist = all.filter((e) => {
      return e.service.buyers.includes(`${user}`) && e.service.status === false
    })
    const list = unicos(prelist, "service")
    const loosed = list.filter((i) => {
      return i.buyer._id != id && i.service.status === false
    })
    res.status(200).json({ message: 'My Loosed Auctions list returned', data: loosed });
  } catch (err) {
    next(err)
  }
});

//Lista de auctions finalizadas donde he ganado la puja
router.get('/auctions/bidded/winned', isLoggedIn(), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const all = await Bid.find().sort({ price: -1 }).populate('service').populate('buyer');
    const prelist = unicos(all, "service")
    const list = prelist.filter((e) => {
      return e.buyer.equals(id) && e.service.status === false
    })
    res.status(200).json({ message: 'MyWinned Auctions list returned', data: list });
  } catch (err) {
    next(err)
  }
});


//Detalle de la auction
router.get('/auction/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  try {
    const auction = await Bid.find({ service: { $eq: id } }).sort({ price: -1 }).limit(1).populate('service').populate('buyer');
    const ownerId = auction[0].service.owner
    const owner = await User.findById(ownerId)
    const data = { auction, owner}
    res.status(200).json({ message: 'Auction detail', data: data })
    console.log(auction);
  } catch (err) {
    next(err);
  }
});


//Borrar servicio y todas sus pujas
router.delete('/auction/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params
  try {
    await Service.findByIdAndDelete(id);
    await Bid.deleteMany({ service: { $eq: id } });
    res.status(200).json({ message: 'Auction deleted' })
  } catch (err) {
    next(err)
  }
});

//Crear bid
router.post('/bid/create', isLoggedIn(), async (req, res, next) => {
  console.log(req.body)
  const service = req.body.id;
  const buyer = req.session.currentUser._id;
  const price = req.body.price
  const newBid = { service, buyer, price}
  try {
    await Bid.create(newBid);
    const profile = await User.findById(buyer)
    let user = profile.username
    await Service.findByIdAndUpdate(service, {$push : {"buyers": user} })
    res.status(200).json({ message: 'bid created' })
  } catch (err) {
    next(err)
  }
})


router.get('/', isLoggedIn(), async (req, res, next) => {
  try {
    const auction = await Service.find().sort({ EndingTime }).limit(1);
    const endTime = new Date(aution.EndingTime);

    console.log(now);
    if (end - now > 100000) {
      setTimeout(check(), 100000);    
    }
    else {
      setTimeout(check(), auction.EndingTime - auction)
    }
  }
  catch (err) {
    next(err);
  }
});

// busquem registres >= que datetime
//db.services.find({ EndingTime: {"$gte": new Date("2019-05-17T13:42:13Z")}})
// busquem auctions caducades que estan actives
//db.services.find({ EndingTime: {"$lt": new Date("2019-05-22T13:00:13Z")}, status : true}).count()


/*
router.get('/check', isLoggedIn(), async (req, res, next) => {
  const now = moment();

  try {
    const auction = await Service.find().sort({ EndingTime }).limit(1);
    const endTime = new Date(aution.EndingTime);

    console.log(now);
    if (end - now > 100000) {
      setTimeout(check(), 100000);    
    }
    else {
      setTimeout(check(), auction.EndingTime - auction)
    }
  }
  catch (err) {
    next(err);
  }
});
*/

module.exports = router;