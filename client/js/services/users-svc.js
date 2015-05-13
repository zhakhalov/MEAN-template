(function (ng) {
  ng.module('app')
  .service('UsersSvc', [ 'REST_API_ROUTE', '$http', '$resource', '$q',
    function (REST_API_ROUTE, $http, $resource, $q) {
      var _users = {};
      var _userId;
      var self = this;
      /**
       * Gets user by [_id].
       * @param id{String} User _id.
       * @param success {Function} Success callback.
       * @param error {Function} Error callback.
       * @return {Promise}
       */
      self.getUser = function (id, success, error) {
        return $q(function (resolve, reject) {
          if (id in _users) {
            resolve(_users[id]);
          } else {
            var User = $resource(REST_API_ROUTE + 'users/:id');
            User.get({ id: id })
            .$promise.then(function (user) {
              _users[id] = user;
              if (typeof success === 'function') {
                success(user);
              }
              resolve(user);
            }, function (err) {
              if (typeof error === 'function') {
                error(err);
              }
              reject(err);
            });
          }
        });
      };
      /**
       * Gets/Sets current user.
       * @param user current user.
       * @returns {Object} Current user.
       */
      self.user = function (user) {
        if ('undefined' === typeof user) { return _users[_userId]; }
        _userId = user._id;
        _users[_userId] = user;
      };
    }]);
})(window.angular);