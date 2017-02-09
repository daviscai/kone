'use strict'

// https://github.com/koajs/koa/pull/751
//if (process.env.OVERRIDE_PROMISE) {
//global.Promise = require('bluebird')
//}


const Kwan  = require('../../app/core/');
const jsonp = require('../../app/middleware/jsonp');
const router = require('../../app/middleware/router');

const app = new Kwan();

app.use(jsonp());

app.use(router());

// app.use((ctx)=>{
//     ctx.body = 'haha';
//     ctx.status = 200;
// });

app.listen(7005)
