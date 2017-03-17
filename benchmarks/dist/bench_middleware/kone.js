'use strict';

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

var path = require('path');
var appDir = path.resolve(__dirname, '../../../');

var Kone = require(appDir + '/app/core/');
var jsonp = require(appDir + '/app/middleware/jsonp');
var router = require(appDir + '/app/middleware/router');
var logger = require(appDir + '/app/middleware/logger');
var staticServer = require(appDir + '/app/middleware/static');
var bodyParser = require(appDir + '/app/middleware/bodyparser');
var session = require(appDir + '/app/middleware/session');
var i18n = require(appDir + '/app/middleware/i18n');
var views = require(appDir + '/app/middleware/template');
var cors = require(appDir + '/app/middleware/cors');
var csrf = require(appDir + '/app/middleware/csrf');
var helmet = require(appDir + '/app/middleware/helmet');
var favicon = require(appDir + '/app/middleware/favicon');

var configDir = path.resolve(__dirname, appDir + '/app/config');

var app = new Kone();

app.last(jsonp());

var logDir = path.join(appDir, 'logs');
app.use(logger({
  logDir: logDir,
  logFileName: 'error.log'
}));

// server static file
app.last(staticServer('assets', appDir + '/assets/'));

// bodyparse
app.use(bodyParser());

// session
app.use(session());

// i18n
app.use(i18n(app, {
  //defaultLocale: 'zh-cn',
  cookie: 'lang',
  locales: ['zh-cn', 'en'],
  directory: configDir + '/locales'
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());

//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(appDir + '/favicon.ico'));

//views template
app.use(views(appDir + '/app/views', {
  extension: 'tpl',
  map: {
    tpl: 'nunjucks'
  }
}));

app.use(router());

app.listen(7005);