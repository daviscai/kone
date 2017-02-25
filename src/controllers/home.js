import Redis from 'ioredis';
import models from '../models/index';

const index = async (ctx) => {
    ctx.session.user = "tom3";
    let sess = ctx.session;

    ctx.log.info('abc');

    let a = ctx.i18n.__('app.title');

    ctx.store.get('csrf');

    await ctx.render("home/reg.tpl", {title:a});

    //ctx.body = 'aaa';
    //ctx.status = 200;
};


const testI18n = (ctx)=>{
    let title = ctx.i18n.__('app.title');
    ctx.body = title;
    ctx.status = 200;
};

const testCsrf = (ctx)=>{
    let csrf = ctx.csrf;
    console.log(csrf);
};

const testLogger = (ctx)=>{
    /*
    ctx.log.trace('this is trace');
    ctx.log.debug('this is debug');
    ctx.log.info('this is info');
    ctx.log.warn('this is warn');
    ctx.log.error('this is error');
    ctx.log.fatal('this is fatal');
    */
    ctx.log.debug('this is debug');
    ctx.status = 200;
};

const testRedis = ()=>{
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
    let rs = await models.User.findById('111');
    console.log(rs);
};

const testJson = (ctx)=>{
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
