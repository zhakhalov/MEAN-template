var security = global.__require('modules/security');

module.exports = function (router) {
  router
  .post('/auth/token', security.ensureAuthenticated, function (req, res, next) {
    res.send({ token: security.token(req.user) });
  })
  /**
   * Sign In user.
   * req.body = { usenrame: '_monolith', password: '123456' }
   */
  .post('/auth/signin', function (req, res, next) {
    security.signIn(req.body, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.send(data);
      }
    });
  })
  /**
   * Sign Up new User.
   * req.body = UserModel
   */
  .post('/auth/signup', function (req, res, next) {
    security.signUp(req.body, function (err, data) {
      if (err) {
        next(err);
      } else {
        res.send(data);
      }
    });
  });
};