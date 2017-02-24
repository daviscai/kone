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
var appDir = path.resolve(__dirname, '../../../');

var Kwan = require(appDir + '/app/core/');
var jsonp = require(appDir + '/app/middleware/jsonp');
//const router = require(appDir+'/app/middleware/router');
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

app.use(jsonp()); // 9.55

var logDir = path.join(appDir, 'logs'); // 10.33
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.use(staticServer('assets', appDir + '/assets/')); // 13.31

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

//views template
app.use(views(appDir + '/app/views', { // 18.22
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors()); // 19.06


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(appDir + '/favicon.ico'));

//app.use(router());

app.use(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx) {
        var sess, a;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        ctx.session.user = "tom";
                        sess = ctx.session;
                        //console.log(sess);
                        //

                        ctx.log.info(sess);
                        //
                        // //ctx.i18n.setLocale('zh-cn');
                        a = ctx.i18n.__('app.title');
                        //
                        //await ctx.render("home/reg.tpl", {title:a});

                        ctx.body = a;

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}());

app.listen(7005);

/**
 *
```
 kwan vs koa , use jsonp , logger, router middleware
 ./node_modules/.bin/autocannon -c 100 -d 5
------- kwan -------
xxx("hello index");
Stat         Avg     Stdev     Max
Latency (ms) 15.59   5.44      98
Req/Sec      6214    653.4     6727
Bytes/Sec    1.14 MB 120.66 kB 1.25 MB

31k requests in 5s, 5.69 MB read

------- koa -------
;xxx("hello koa");
Stat         Avg      Stdev    Max
Latency (ms) 34.04    8.11     139
Req/Sec      2887.8   281.44   3131
Bytes/Sec    473.5 kB 45.88 kB 524.29 kB

14k requests in 5s, 2.37 MB read
```

```
 kwan vs koa , use jsonp , logger, static, bodyparse, session, i18n, csrf, template middleware
  ./node_modules/.bin/autocannon -c 100 -d 5
 ------- kwan -------
 xxx("kwan is a framework base on Koa2 for node.js");
 Stat         Avg       Stdev     Max
 Latency (ms) 42.13     14.19     163
 Req/Sec      2341.2    331.03    2601
 Bytes/Sec    989.59 kB 146.03 kB 1.11 MB

 12k requests in 5s, 4.95 MB read

 koa deprecated Support for generators will been removed in v3. See the documentation for examples of how to convert old middleware https://github.com/koajs/koa/tree/v2.x#old-signature-middleware-v1x---deprecated dist/bench_middleware/koa.js:73:5
 ------- koa -------
 ;xxx("hello");
 Stat         Avg       Stdev   Max
 Latency (ms) 78.22     15.16   266
 Req/Sec      1263.41   68.79   1329
 Bytes/Sec    202.34 kB 9.55 kB 212.99 kB

 6k requests in 5s, 1.01 MB read
```

 */