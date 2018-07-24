const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;


/** Return the Passport Local Strategy Object */

module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passwordReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // find a user by email address
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect Email or Password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    const payload = {
      sub: user._id
    };

    // create a token String
    const token = jwt.sign(payload, config.jwtSecret);
    const data = {
      name: user.name
    };

    return done(null, token, data);
    });
  });
