//const path  = require('path');
const Kwan  = require('./core/');
const jsonp = require('./middleware/jsonp');
const router = require('./middleware/router');

//const appDir = path.resolve(__dirname, '..');
//const configDir = path.resolve(__dirname, './config');

const app = new Kwan();

app.use(jsonp());

app.use(router());

// import Koa from 'koa';
// import jsonp from 'koa-jsonp';
//
// const app = new Koa();
//
// app.use(jsonp());
//
// app.use((ctx)=>{
//     ctx.body = 'hello';
//     ctx.status = 200;
// });

/*
import Koa from 'koa';
import path from 'path';
import fs from 'fs';
import jsonp from './middleware/kwan-jsonp';
import views from 'koa-views';
import log4js from 'koa-log4';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session-minimal';
import csrf from 'koa-csrf';
import convert from 'koa-convert';
import locale from 'koa-locale';
import i18n from 'koa-i18n';
import jsonp from 'koa-jsonp';
import server from 'koa-static2';
import router from './routers';

// Create the app from the ES6 class.
const app = new Koa();

// app.use(jsonp());  // todo  3ms

const appDir = path.resolve(__dirname, '..');
const configDir = path.resolve(__dirname, './config');
const logDir = path.join(appDir, 'logs');

log4js.configure(path.join(appDir, 'log4js.json'), {
    cwd: logDir,
    reloadSecs: 1
});
const logger = log4js.getLogger('http');

// server static file
app.use(server("assets", __dirname + '/../assets'));

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
app.use(
    log4js.koaLogger(logger, {level: 'auto'})
);

// put logger into ctx
app.use( async (ctx, next)=>{
    ctx.logger = logger;
    await next();
});

// use nunjucks template , todo 50ms
app.use(views(__dirname + '/views', {
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
    invalidTokenStatusCode: 403,
}));


// use koa-router router
// app.use(router.routes(), router.allowedMethods());

app.use((ctx)=>{
    ctx.body = 'hello';
    ctx.status = 200;
});
*/

export default app;
