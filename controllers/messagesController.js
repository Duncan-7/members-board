const User = require('../models/user');
const Message = require('../models/message');
const validator = require('express-validator');

exports.getCreate = function (req, res, next) {
  if (req.user) {
    res.render('message_form', { title: 'New Message', message: false, errors: false });
  } else {
    res.redirect('/users/login');
  }
}

exports.postCreate = [
  validator.body('title', 'Title is required').isLength({ min: 1, max: 50 }).trim(),
  validator.body('body', 'Message is required').isLength({ min: 1, max: 300 }).trim(),
  validator.sanitizeBody('title').escape(),
  validator.sanitizeBody('body').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      res.render('message_form', { title: 'New Message', message: req.body, errors: errors.array() });
      return;
    }
    else {
      const message = new Message({
        title: req.body.title,
        body: req.body.body,
        author: req.user.id,
        timestamp: Date.now()
      });
      message.save(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
      })
    }
  }
]

exports.postDelete = function (req, res, next) {
  if(req.user.admin) {
    Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
      if (err) { return next(err); }
      res.redirect("/");
    })
  } else {
    res.redirect("/");
  } 
}