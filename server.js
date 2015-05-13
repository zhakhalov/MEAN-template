global.__require = function (path) {
  return require(require('path').join(__dirname, path));
};
//-----------------------------------------------------------------
// npm modules
//-----------------------------------------------------------------
var http = require('http');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');

//-----------------------------------------------------------------
// modules
//-----------------------------------------------------------------

var dbCfg = require('./config/db-cfg');
var commonCfg = require('./config/common-cfg');

//-----------------------------------------------------------------
// controllers
//-----------------------------------------------------------------

var AuthCtrl = require('./controllers/auth-api-ctrl');
var UsersCtrl = require('./controllers/users-api-ctrl');
var ErrCtrl = require('./controllers/err-api-ctrl');

//-----------------------------------------------------------------
// bootstap app
//-----------------------------------------------------------------

// -----  express

var app = express();
var apiRouter = express.Router();
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiRouter);

var server = http.createServer(app);
// -----  controllers

AuthCtrl(apiRouter);
UsersCtrl(apiRouter);
ErrCtrl(apiRouter);

// -----  logger

winston.add(winston.transports.File, { filename: path.join(__dirname, commonCfg.logFileName) });

//-----------------------------------------------------------------
// start app
//-----------------------------------------------------------------

mongoose.connect(dbCfg.connectionString, function (err) {
  if (err) {
    winston.error({ category:'database', message: 'could not connect', err: err });
  } else {
    winston.info({ category:'database', message: 'connected' });
  }
});

server.listen(process.env.PORT, process.env.IP, function () {
  var addr = server.address();
  winston.info('server started at ' + addr.port);
});
