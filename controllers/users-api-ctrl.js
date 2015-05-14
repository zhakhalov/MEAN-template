var UserModel = global.__require('models/user-model');

module.exports = function (router) {
  router
  .get('/users/removeall', function (req, res, next) {
    UserModel.remove().exec(function (err) {
      if (err) {
        next(err);
      } else {
        res.send('All users succesfully removed.');
      }
    });
  })
  .get('/users/exists', function (req, res, next) {
     UserModel.findOne({ $or: [{ username: req.query.login }, { email: req.query.login }] }, function (err, doc) {
       if (err) {
         next(err);
       } else {
         res.send(null != doc);
       }
     });
  })
  .get('/users', function (req, res, next) {
    UserModel.find(req.query).lean().exec(function (err, docs) {
      if (err) {
         next(err);
       } else {
         res.send(docs);
       }
    });
  })
  .get('/users/:id', function (req, res, next) {
    UserModel.findById(req.params.id).lean().exec(function (err, doc) {
      if (err) {
         next(err);
       } else {
         res.send(doc);
       }
    });
  })
};