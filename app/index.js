import Koa from 'koa';
import path from 'path';
import fs from 'fs';
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

const appDir = path.resolve(__dirname, '..');
const configDir = path.resolve(__dirname, './config');
const logDir = path.join(appDir, 'logs');

/**
 * make a log directory, just in case it isn't there.
 */
try {
  fs.mkdirSync(logDir);
} catch (e) {
  if (e.code != 'EEXIST') {
    process.exit(1);
  }
}
log4js.configure(path.join(appDir, 'log4js.json'), { cwd: logDir, reloadSecs: 1 });
const logger = log4js.getLogger('http');

// Create the app from the ES6 class.
const app = new Koa();

// server static file
app.use(server("assets", __dirname+'/../assets'));

app.use(jsonp());

// for i18n
locale(app);
// support i18n
app.use(convert(i18n(app, {
  directory: configDir + '/locales',
  locales: ['zh-cn', 'en'], //  `zh-cn` defualtLocale, must match the locales to the filenames
  modes: [                  //  If one mode is detected, no continue to detect.
    'query',                //  optional detect querystring - `/?locale=en-US`
    'subdomain',            //  optional detect subdomain   - `zh-CN.koajs.com`
    'cookie',               //  optional detect cookie      - `Cookie: locale=zh-TW`
    'header',               //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
    'url',                  //  optional detect url         - `/en`
    'tld'                  //  optional detect tld(the last domain) - `koajs.cn`
  ]
})));

// support session,  csrf need it
app.use(session());

// support body parser
app.use(bodyParser());

// use log4js logger
app.use(log4js.koaLogger(logger, { level: 'auto' }));

// use nunjucks template
app.use(views(__dirname + '/views', { extension: 'tpl', map: { tpl: 'nunjucks' } }));

// add the CSRF middleware
app.keys = ['secret'];
app.use(new csrf({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
}));

// use koa-router router
app.use(router.routes(), router.allowedMethods());

/*
logger.trace('this is trace');
logger.debug('this is debug');
logger.info('this is info');
logger.warn('this is warn');
logger.error('this is error');
logger.fatal('this is fatal');
*/

export default app;
