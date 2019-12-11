var express = require('express');
var router = express.Router();
const Message = require('../models/message');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.user && req.user.member) {
    Message.find().populate('author').exec(function (err, messages) {
      if (err) { return next(err); }
      res.render('index', { title: 'Message Board', user: req.user, messages: messages });
    });
  } else {
    Message.find().exec(function (err, messages) {
      if (err) { return next(err); }
      messages.forEach(message => {
        message["author"] = undefined
      });
      res.render('index', { title: 'Message Board', user: req.user, messages: messages });
    });
  }

});

module.exports = router;
