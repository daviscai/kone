//import models from '../models/index';
const Cat = require('../models/cat');

const index = async (ctx) => {
    ctx.session.user = "tom3";
    let sess = ctx.session;

    ctx.log.info('abc');

    let a = ctx.i18n.__('app.title');

    ctx.store.get('csrf');

    //await ctx.render("home/reg.tpl", {title:a});

    // ctx.body = 'aaa';
    // ctx.status = 200;
};


const testI18n = (ctx)=>{
    let title = ctx.i18n.__('app.title');
    ctx.body = title;
    ctx.status = 200;
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

const testRedis = async (ctx)=>{
    if(ctx.redis){
        await ctx.redis.set('foo','hello2');
        let a = await ctx.redis.get('foo');
        ctx.body = a;
    }
    ctx.status = 200;
};

const testMongo = async (ctx)=>{
    if(ctx.mongo){
        let catModel = Cat.make(ctx.mongo);
        var kitty = new catModel({ name: 'Zildjian', friends: ['tom', 'jerry']});
        kitty.age = 5;

        kitty.save().then( (doc)=>{
            //console.log(doc)
        });

        let query = await catModel.findOne({name: "Zildjian"}).exec();
        //console.log(query);

        ctx.body = query;
    }
    ctx.status = 200;
};

const testDB = async ()=>{
    //let rs = await models.User.findById('111');
    //console.log(rs);
};

const testTemplate = async (ctx)=>{
    await ctx.render("home/reg.tpl", {title:'hello'});
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
    testLogger,
    testRedis,
    testMongo,
    testDB,
    testTemplate,
    testAntd,
    reg
};
