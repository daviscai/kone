//import models from '../models/index';
const User = require('../models/user');
const Cat = require('../models/cat');

const index = async (ctx) => {
    ctx.session.user = "tom3";
    let sess = ctx.session;

    //ctx.log.info('abc');

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


const testLogger = async (ctx)=>{
    ctx.log.debug('api','this is infoss');
    ctx.log.info('api','this is infoss');
    ctx.log.warn('api','this is warn'); 
    // ctx.log.error('app','this is error');
    // ctx.log.fatal('app','this is fatal');

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

const testDB = async (ctx)=>{
    let userModel = User.make(ctx.db);

    let rs = await userModel.findById('111');
    ctx.status = 200;
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
