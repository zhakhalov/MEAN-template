var mongoose = require('mogoose');

var UserSchema = new mongoose.Schema({
  username: { type:String, required: true },
  password: { type:String, required: true },
  email: { type:String, required: true },
  roles: { type:Array, default: ['user'] },
  createdAt: { type:Date, default: Date.now },
  updatedAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('UserModel', UserSchema);