'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

const path  = require('path');
const appDir = path.resolve(__dirname, '../../../');

const Kwan  = require(appDir+'/app/core/');
const jsonp = require(appDir+'/app/middleware/jsonp');
//const router = require(appDir+'/app/middleware/router');
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

app.use(jsonp());  // 9.55

const logDir = path.join(appDir, 'logs'); // 10.33
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.use(staticServer('assets',appDir+'/assets/'));  // 13.31

// bodyparse
app.use(bodyParser()); // 15.01

// session
app.use(session()); // 16.53


// i18n
app.use(i18n(app, {  // 17.78
    //defaultLocale: 'zh-cn',
    cookie: 'lang',
    locales:['zh-cn', 'en'],
    directory: configDir + '/locales'
}));

//views template
app.use(views(appDir+'/app/views', {  // 18.22
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());  // 19.06


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(appDir+'/favicon.ico'));


//app.use(router());

app.use(  async (ctx)=>{

    ctx.session.user = "tom";
    let sess = ctx.session;
    //console.log(sess);
    //
    ctx.log.info(sess);
    //
    // //ctx.i18n.setLocale('zh-cn');
    let a = ctx.i18n.__('app.title');
    //
    //await ctx.render("home/reg.tpl", {title:a});

    ctx.body = a;
})

app.listen(7005)


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
