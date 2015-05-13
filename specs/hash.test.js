// This file holds folder in VCS ))

var hash = require('password-hash');

exports.testHash = function (test) {
  test.ok(hash.verify('123456', hash.generate('123456')), 'Test verification of hashed password "123456"');
  test.done();
};