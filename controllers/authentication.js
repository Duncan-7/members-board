const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

//set up local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log("test")
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      };
      if (!user) {
        return done(null, false, { msg: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          console.log("match")
          return done(null, user)
        } else {
          // passwords do not match!
          console.log("wrong")
          return done(null, false, { msg: "Incorrect password" })
        }
      })
    });
  })
);

//serialisation and session creation
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
//provides currentUser variable to all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});