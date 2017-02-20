import Redis from 'ioredis';
import models from '../models/index';

const index = async (ctx) => {

    ctx.body = ctx.query;
    ctx.session.user = "tom";
    let sess = ctx.session;

    ctx.log.error(sess);

    ctx.i18n.setLocale('zh-cn');
    let a = ctx.i18n.__('app.title');

    // 模板必须使用 async/await 异步方式
    //await ctx.render("home/list.tpl", {title:a});
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
    ctx.logger.trace('this is trace');
    ctx.logger.debug('this is debug');
    ctx.logger.info('this is info');
    ctx.logger.warn('this is warn');
    ctx.logger.error('this is error');
    ctx.logger.fatal('this is fatal');
    */
    ctx.logger.debug('this is debug');
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
