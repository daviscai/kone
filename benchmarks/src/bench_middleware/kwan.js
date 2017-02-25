'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

const path  = require('path');
const appDir = path.resolve(__dirname, '../../../');

const Kwan  = require(appDir+'/app/core/');
const jsonp = require(appDir+'/app/middleware/jsonp');
const router = require(appDir+'/app/middleware/router');
const logger = require(appDir+'/app/middleware/logger');
const staticServer = require(appDir+'/app/middleware/static');
const bodyParser = require('trek-body-parser');
const session = require(appDir+'/app/middleware/session');
const i18n = require(appDir+'/app/middleware/i18n');
const views = require(appDir+'/app/middleware/template');
const cors = require(appDir+'/app/middleware/cors');
const csrf = require(appDir+'/app/middleware/csrf');
const helmet = require(appDir+'/app/middleware/helmet');
const favicon = require(appDir+'/app/middleware/favicon');


const configDir = path.resolve(__dirname, appDir+'/app/config');

const app = new Kwan();

app.last(jsonp());

const logDir = path.join(appDir, 'logs');
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.last(staticServer('assets',appDir+'/assets/'));

// bodyparse
app.use(bodyParser());

// session
app.use(session());


// i18n
app.use(i18n(app, {
    //defaultLocale: 'zh-cn',
    cookie: 'lang',
    locales:['zh-cn', 'en'],
    directory: configDir + '/locales'
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(appDir+'/favicon.ico'));


//views template
app.use(views(appDir+'/app/views', { 
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

app.use(router());


app.listen(7005)
