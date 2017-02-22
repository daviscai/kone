'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

const path  = require('path');
const Koa = require('koa');
//const router = require('koa-router')();
const views = require('koa-views');
const log4js = require('koa-log4');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const csrf = require('koa-csrf').default;
const convert = require('koa-convert');
const locale = require('koa-locale');
const i18n = require('koa-i18n');
const jsonp = require('koa-jsonp');
const server = require('koa-static2');
//const router = './routers';

// Create the app from the ES6 class.
const app = new Koa();

const appDir = path.resolve(__dirname, '../../../');
const benchDir = path.resolve(__dirname, '../../');
const configDir = benchDir + '/config';
const logDir = path.join(appDir, 'logs');

log4js.configure(path.join(configDir, 'log4js.json'), {
    cwd: logDir,
    reloadSecs: 1
});
const logger = log4js.getLogger('http');

// server static file
app.use(server("assets", appDir + '/assets'));

app.use(jsonp());  // todo  3ms

// for i18n
locale(app);

// support i18n  // todo 40ms
app.use(convert(i18n(app, {
    directory: configDir + '/locales',
    locales: ['zh-cn', 'en'], //  `zh-cn` defualtLocale, must match the locales to the filenames
    modes: [ //  If one mode is detected, no continue to detect.
        'query', //  optional detect querystring - `/?locale=en`
        'subdomain', //  optional detect subdomain   - `zh-CN.koajs.com`
        'cookie', //  optional detect cookie      - `Cookie: locale=zh-cn`
        'header', //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
        'url', //  optional detect url         - `/en`
        'tld' //  optional detect tld(the last domain) - `koajs.cn`
    ]
})));


// support session,  csrf need it
app.use(session()); // todo 3-5ms

// support body parser
app.use(bodyParser());


// use log4js logger  todo 20-25ms
// app.use(
//     log4js.koaLogger(logger, {level: 'auto'})
// );

// put logger into ctx
app.use( async (ctx, next)=>{
    ctx.logger = logger;
    await next();
});

// use nunjucks template , todo 50ms
app.use(views(appDir + '/app/views', {
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

// add the CSRF middleware  todo 10ms
app.keys = ['secret'];
app.use(new csrf({
    invalidSessionSecretMessage: 'Invalid session secret',
    invalidSessionSecretStatusCode: 403,
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403
}));

// use koa-router router
//app.use(router.routes(), router.allowedMethods());

app.use((ctx)=>{
    ctx.body = 'hello';
    ctx.status = 200;
});

app.listen(7002)
