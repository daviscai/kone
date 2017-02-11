'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

const path  = require('path');
const Kwan  = require('../../app/core/');
const jsonp = require('../../app/middleware/jsonp');
const router = require('../../app/middleware/router');
const logger = require('../../app/middleware/logger');
const appDir = path.resolve(__dirname, '../../');

const app = new Kwan();

app.use(jsonp());

//app.use(logger());
const logDir = path.join(appDir, 'logs');
app.use(logger({
    logDir: logDir,
    logFileName: 'error1.log'
}));

app.use(router());

// app.use((ctx)=>{
//     ctx.body = 'haha';
//     ctx.status = 200;
// });

app.listen(7005)


/**
 *  ```
 * kwan vs koa , use jsonp , logger, router middleware
 *  ------- kwan -------
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
 *  ```
 */
