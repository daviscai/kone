import Koa from 'koa';

// //Create the app from the ES6 class.
const app = new Koa();

app.use(async (ctx, next) => ctx.body = 'Hello World');

export default app;
