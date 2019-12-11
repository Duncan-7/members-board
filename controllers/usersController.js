const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('express-validator');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require('dotenv').config();


exports.getSignup = function (req, res, next) {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render('signup_form', { title: 'Signup', user: false, errors: false });
  }
}

exports.postSignup =
  [
    validator.body('first_name', 'First name required').isLength({ min: 1, max: 30 }).trim(),
    validator.body('last_name', 'Last name required').isLength({ min: 1, max: 30 }).trim(),
    validator.body('email', 'Email required').isLength({ min: 1, max: 50 }).isEmail().trim(),
    validator.body('password', 'Password required').isLength({ min: 1 }).trim(),
    validator.check('confirm_password', 'Confirm password field must have the same value as the password field')
      .exists()
      .custom((value, { req }) => value === req.body.password),

    validator.sanitizeBody('first_name').escape(),
    validator.sanitizeBody('last_name').escape(),
    validator.sanitizeBody('email').escape(),
    validator.sanitizeBody('password').escape(),
    validator.sanitizeBody('confirm_password').escape(),

    (req, res, next) => {
      const errors = validator.validationResult(req);
      if (!errors.isEmpty()) {
        res.render('signup_form', { title: 'Signup', user: req.body, errors: errors.array() });
        return;
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            member: false,
            admin: false
          }).save(err => {
            if (err) {
              return next(err);
            };
            console.log("user created")

            res.redirect('/users/login');
          });
        });
      }
    }
  ]

exports.getLogin = function (req, res, next) {
  if (req.user) {
    res.redirect("/")
  } else {
    res.render('login_form', { title: 'Login', user: false, errors: false });
  }
}

exports.postLogin =
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login"
  })

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
}

exports.getMember = function (req, res, next) {
  if (req.user) {
    res.render('member_form', { title: "Become a Member", message: "Enter the secret password to join the club." });
  } else {
    res.redirect("login");
  }
}

exports.postMember = [
  validator.sanitizeBody("secret").escape(),
  (req, res, next) => {
    if (req.body.secret == process.env.ADMIN_PASSWORD) {
      const user = req.user;
      user.member = true;
      user.admin = true;
      User.findByIdAndUpdate(req.user._id, user, {}, function (err) {
        if (err) { return next(err) }
        res.redirect("/");
      })
    }
    else if (req.body.secret == process.env.SECRET_PASSWORD) {
      const user = req.user;
      user.member = true;
      User.findByIdAndUpdate(req.user._id, user, {}, function (err) {
        if (err) { return next(err) }
        res.redirect("/");
      })
    } else {
      res.render('member_form', { title: "Become a Member", message: `Incorrect password. You are not welcome in the no-${req.user.first_name}s club.` });
    }
  }
]
