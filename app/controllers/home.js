import Redis from 'ioredis';
import models from '../models/index';

const index = async (ctx) => {
    ctx.status = 200;
};

const testI18n = async (ctx)=>{
    let title = ctx.i18n.__('app.title');
    ctx.body = 'test2';
    console.log(title);
    ctx.status = 200;
};

const testCsrf = async (ctx)=>{
    let csrf = ctx.csrf;
    console.log(csrf);
};

const testLogger = async (ctx)=>{
    ctx.logger.debug('this is debug');
};

const testRedis = async ()=>{
    let redis = new Redis(6380);
    redis.set('foo','hello2');
    redis.get('foo').then((rs)=>{
        console.log(rs);
    });

    var redisCluster = new Redis.Cluster([
      {port: 7000,host: '127.0.0.1'},
      {port: 7001,host: '127.0.0.1'},
      {port: 7002,host: '127.0.0.1'},
      {port: 7003,host: '127.0.0.1'},
      {port: 7004,host: '127.0.0.1'},
      {port: 7005,host: '127.0.0.1'}
    ]);

    redisCluster.on('error',(err)=>{
        console.log('node error', err.lastNodeError);
    });

    redisCluster.set('foo', 'bar');
    redisCluster.get('foo', function (err, res) {
        console.log(res);
    });
};

const testDB = async ()=>{
    let rs = models.User.findById('111');
    console.log(rs);
};

const testJson = async (ctx)=>{
    ctx.body = ctx;
};

const testTemplate = async (ctx)=>{
    await ctx.render("home/index.tpl", {
        title: "nunjucks template engine!",
        csrf:ctx.csrf,
    });
};

const testAntd = async (ctx) =>{
    await ctx.render('home/list.tpl');
};

const reg = async (ctx) => {
    await ctx.render("home/reg.tpl", {title:"reg"});
};

export default {
    index,
    testI18n,
    testCsrf,
    testLogger,
    testRedis,
    testDB,
    testJson,
    testTemplate,
    testAntd,
    reg
};
