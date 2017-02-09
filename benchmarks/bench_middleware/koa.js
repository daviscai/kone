'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}

const Koa = require('koa');
const Jsonp = require('koa-jsonp');
const router = require('koa-router')();
//const Home = require('../../app/controllers/home');

const app = new Koa();

router.get('/', (ctx)=>{
    ctx.body = 'hello koa';
    ctx.status = 200;
});

app.use(Jsonp());

app.use(router.routes(), router.allowedMethods());

// app.use((ctx)=>{
//     ctx.body = 'hello';
//     ctx.status = 200;
// });

app.listen(7002)
