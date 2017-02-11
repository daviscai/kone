'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}
const path  = require('path');
const Koa = require('koa');
const Jsonp = require('koa-jsonp');
const router = require('koa-router')();
const logger = require('../../app/middleware/logger');
const appDir = path.resolve(__dirname, '../../');

const app = new Koa();

router.get('/', (ctx)=>{
    ctx.log.info('this is koa logger');
    ctx.body = 'hello koa';
    ctx.status = 200;
});

app.use(Jsonp());

//app.use(logger());
const logDir = path.join(appDir, 'logs');
app.use(logger({
    logDir: logDir,
    logFileName: 'error2.log'
}));

app.use(router.routes(), router.allowedMethods());

// app.use((ctx)=>{
//     ctx.body = 'hello';
//     ctx.status = 200;
// });

app.listen(7002)
