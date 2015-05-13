(function (ng) {
  ng.module('app')
  .service('AuthSvc', [ 'REST_API_ROUTE', 'TOKEN_STORAGE', 'AUTH_SCHEMA', 'Auth', 'UsersSvc', '$q', '$window', '$http',
    function (REST_API_ROUTE, TOKEN_STORAGE, AUTH_SCHEMA, Auth, UsersSvc, $q, $window, $http) {
      var _auth = new Auth();
      var _token = null;
      var self = this;

      try {
        _token = JSON.parse($window.localStorage)[TOKEN_STORAGE];
      } catch (err) {

      }

      self.refreshToken = function() {
        return $q(function (resolve, reject) {
          $http.post(REST_API_ROUTE + 'auth/refresh', {}, { headers: { Authorization: self.token() } })
          .success(function (res) {
            _token = $window.localStorage = res.token;
            resolve(true);
          })
          .error(function (res) {
            self.signOut();
            reject(res);
          });
        });
      };
      /**
       * Sing in user
       * @param login {String} user's login
       * @param password {String} user's password
       * @param success {Function} success callback
       * @param error {Function} error callback
       */
      self.signIn = function (login, password, success, error) {
        return $q(function (resolve, reject) {
          _auth.signIn(login, password)
          .then( function (res) {
            _token = res.token;
            if (typeof success === 'function') {
              success(res);
            }
            resolve(res);
          }, function (err) {
            if (typeof error === 'function') {
              error(err);
            }
            reject(err);
          });
        });
      };
      /**
       * Register user
       * @param user {{ username: String, password: String, email: String }} user
       * @param success {Function} success callback
       * @param error {Function} error callback
       */
      self.signUp = function (user, success, error) {
        return $q(function (resolve, reject) {
          _auth.signUp(user)
          .then(function (res) {
            _token = res.token;
            if (typeof success === 'function') {
              success(res);
            }
            resolve(res);
          }, function (err) {
            if (typeof error === 'function') {
              error(err);
            }
            reject(err);
          });
        });
      };
      /**
       * Sign out user
       */
      self.signOut = function () {
        _token = null;
        try {
          var storage = JSON.parse($window.localStorage);
          delete storage[TOKEN_STORAGE];
          $window.localStorage = JSON.stringify(storage);
        } catch (err) {

        }
      };
      /**
       * Check is user authenticated
       * @returns {Boolean} Is user authenticated
       */
      self.isAuthenticated = function () {
        return null != _token;
      };
      /**
       * Gets/sets authorization token
       * @param token {String} Authorization token
       * @returns {String} Authorization token
       */
      self.token = function (token) {
        if ('undefined' !== typeof token) {
          _token = token;
          try {
            var storage = JSON.parse($window.localStorage);
            storage[TOKEN_STORAGE] = token;
            $window.localStorage = JSON.stringify(storage);
          } catch (err) {
            storage = { };
            storage[TOKEN_STORAGE] = token;
            $window.localStorage = JSON.stringify(storage);
          }
        }
        return _token;
      };
      /**
       * Gets authorization header 'Brear <token>'
       * @returns {String} Authorization header
       */
      self.header = function () {
        return AUTH_SCHEMA + ' ' + _token;
      };
    }]);
})(window.angular);