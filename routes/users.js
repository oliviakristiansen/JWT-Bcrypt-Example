var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
var models = require('../models');
const auth = require("../config/auth");


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/signup", function (req, res, next) {
  res.render('signup')
});

router.post('/signup', function (req, res, next) {
  models.users.findOrCreate({
    where: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
  }).spread(function (result, created) {
    if (created) {
      res.redirect('profile/' + result.UserId)
    } else {
      res.send('this user already exists')
    }
  });

});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  }).then(user => {
    console.log('then')
    if (!user) {
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(req.body.password);
      if (err) {
        console.log(err);
        return next(err);
      }
      if (isMatch) {
        const userId = user.UserId
        console.log(userId)
        const token = auth.signUser(user);
        res.cookie('jwt', token);
        // console.log(res)
        // res.json({
        //   message: "Logged in",
        //   token: token
        // });
        res.redirect('profile/' + userId)
      }

    });
  });

});

router.get('/profile/:id', auth.verifyUser, function (req, res, next) {
  // console.log(req.params.id)
  // console.log(req.userData)
  // console.log(typeof (req.user.UserId))
  // console.log(typeof (req.params.id))
  if (req.params.id !== String(req.user.UserId)) {
    res.send('This is not your profile')
  } else {
    res.render('profile', {
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      Email: req.user.Email,
      UserId: req.user.UserId,
      Username: req.user.Username
    });
  }



});

module.exports = router;