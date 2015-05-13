var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var hash = require('password-hash');
var securityCfg = global.__require('./config/security-cfg');
var UserModel = global.__require('./models/user-model');

/**
 * Sign In user.
 * @param credentials {Object} Login credentials.
 */
function signIn (credentials, fn) {
  UserModel.findOne({ $or: [{ username: credentials.login }, { email: credentials.login }] }, function (err, user) {
    if (err) {
      fn(err);
    } else if (!user) {
      err = new Error ('Login: [' + credentials.login + '] not found!');
      err.status = 401;
      fn(err);
    } else if (!hash.verify(credentials.password, user.password)) {
      err = new Error ('Password not valid!');
      err.status = 401;
      fn(err);
    } else {
      fn(null, {
        user: user.toObject(), 
        token: token({
          id: user.id || user._id,
          username: user.username,
          email: user.email,
          roles: user.roles
        })
      });
    }
  });
}

/**
 * Sign Up user.
 * @param user {Object} User to sin up.
 * @return {String} Authorization token.
 */
function signUp (user, fn) {
  UserModel.findOne({ $or: [{ username: user.username }, { email: user.email }] }, function (err, doc) {
    if (err) {
      fn(err);
    } else if (doc) {
      err = new Error ('Login: [' + user.login + '] alredy used!');
      err.status = 409;
      fn(err);
    } else {
      user.password = hash.generate(user.password);
      user = new UserModel(user);
      user.save(function (err, doc) {
        if (err) {
          fn(err);
        } else {
          fn(null, {
            user: user.toObject(), 
            token: module.exports.token({
              id: user.id || user._id,
              username: user.username,
              email: user.email,
              roles: user.roles
            })
          });
        }
      });
    }
  });
}

/**
 * Generate token authorization token from payload.
 * @param payload {UserModel} Token payload.
 * @return {String} Authorization token.
 */
function token (payload) {
  return jwt.sign(payload, securityCfg.secret, { expiresInMinutes: securityCfg.expiresInMinutes });
}

module.exports = {
  signIn: signIn,
  signUp: signUp,
  token: token,
  ensureAuthenticated: expressJwt({ secret: securityCfg.secret })
};