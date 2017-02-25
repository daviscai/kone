'use strict';

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

var path = require('path');
var appDir = path.resolve(__dirname, '../../../');

var Kwan = require(appDir + '/app/core/');
var jsonp = require(appDir + '/app/middleware/jsonp');
var router = require(appDir + '/app/middleware/router');
var logger = require(appDir + '/app/middleware/logger');
var staticServer = require(appDir + '/app/middleware/static');
var bodyParser = require('trek-body-parser');
var session = require(appDir + '/app/middleware/session');
var i18n = require(appDir + '/app/middleware/i18n');
var views = require(appDir + '/app/middleware/template');
var cors = require(appDir + '/app/middleware/cors');
var csrf = require(appDir + '/app/middleware/csrf');
var helmet = require(appDir + '/app/middleware/helmet');
var favicon = require(appDir + '/app/middleware/favicon');

var configDir = path.resolve(__dirname, appDir + '/app/config');

var app = new Kwan();

app.last(jsonp()); // 9.55

var logDir = path.join(appDir, 'logs'); // 10.33
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.last(staticServer('assets', appDir + '/assets/')); // 13.31

// bodyparse
app.use(bodyParser()); // 15.01

// session
app.use(session()); // 16.53


// i18n
app.use(i18n(app, { // 17.78
    //defaultLocale: 'zh-cn',
    cookie: 'lang',
    locales: ['zh-cn', 'en'],
    directory: configDir + '/locales'
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors()); // 19.06


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(appDir + '/favicon.ico'));

//views template
app.use(views(appDir + '/app/views', { // 18.22
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

app.use(router());

// app.use(  async (ctx)=>{
//
//     ctx.session.user = "tom";
//     let sess = ctx.session;
//     //console.log(sess);
//     //
//     ctx.log.info(sess);
//     //
//     // //ctx.i18n.setLocale('zh-cn');
//     let a = ctx.i18n.__('app.title');
//     //
//     //await ctx.render("home/reg.tpl", {title:a});
//
//     ctx.body = a;
// })

app.listen(7005);