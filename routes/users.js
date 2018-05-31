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
      username: req.body.username
    }
  }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    console.log(user.comparePassword);
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(req.body.password);
      if (err) {
        console.log(err);
        return next(err);
      }
      if (isMatch) {
        const token = auth.signUser(user);
        res.json({
          message: "Logged in",
          token: token
        });
        res.redirect('profile/' + user.UserId)
      }

    });
  });

});

router.get('/profile/:id', function (req, res, next) {
  if (req.user.UserId === req.params.id) {
    res.render('profile', {
      FirstName: req.user.firstName,
      LastName: req.user.lastName,
      Email: req.user.email,
      UserId: req.user.UserId,
      Username: req.user.username
    });
  } else {
    res.send('This is not your profile')
  }
});

module.exports = router;