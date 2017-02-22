'use strict';

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var Koa = require('koa');
//const router = require('koa-router')();
var views = require('koa-views');
var log4js = require('koa-log4');
var bodyParser = require('koa-bodyparser');
var session = require('koa-session-minimal');
var csrf = require('koa-csrf').default;
var convert = require('koa-convert');
var locale = require('koa-locale');
var i18n = require('koa-i18n');
var jsonp = require('koa-jsonp');
var server = require('koa-static2');
//const router = './routers';

// Create the app from the ES6 class.
var app = new Koa();

var appDir = path.resolve(__dirname, '../../../');
var benchDir = path.resolve(__dirname, '../../');
var configDir = benchDir + '/config';
var logDir = path.join(appDir, 'logs');

log4js.configure(path.join(configDir, 'log4js.json'), {
    cwd: logDir,
    reloadSecs: 1
});
var logger = log4js.getLogger('http');

// server static file
app.use(server("assets", appDir + '/assets'));

app.use(jsonp()); // todo  3ms

// for i18n
locale(app);

// support i18n  // todo 40ms
app.use(convert(i18n(app, {
    directory: configDir + '/locales',
    locales: ['zh-cn', 'en'], //  `zh-cn` defualtLocale, must match the locales to the filenames
    modes: [//  If one mode is detected, no continue to detect.
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
app.use(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        ctx.logger = logger;
                        _context.next = 3;
                        return next();

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

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

app.use(function (ctx) {
    ctx.body = 'hello';
    ctx.status = 200;
});

app.listen(7002);