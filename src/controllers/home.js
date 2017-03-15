//import models from '../models/index';
const User = require('../models/user');
const Cat = require('../models/cat');



const testAll = async(ctx) => {
  ctx.session.user = "tom3";
  let sess = ctx.session;
  //console.log('session:'+sess);

  let a = ctx.i18n.__('app.title');
  //console.log('title:'+a);

  let csrf = ctx.store.get('csrf');
  //console.log('csrf:'+csrf);

  if (ctx.redis) {
    await ctx.redis.set('foo', 'hello2');
    let a = await ctx.redis.get('foo');
    //console.log('redis:'+a);
  }

  if (ctx.mongo) {
    let catModel = Cat.make(ctx.mongo);
    var kitty = new catModel({
      name: 'Zildjian',
      friends: ['tom', 'jerry']
    });
    kitty.age = 5;

    kitty.save().then((doc) => {
      //console.log(doc)
    });

    let query = await catModel.findOne({
      name: "Zildjian"
    }).exec();
    //console.log(query);
  }

  let userModel = User.make(ctx.db);
  let rs = await userModel.findById('111');
  //console.log('mysql:'+rs);

  // await ctx.render("home/reg.tpl", {
  //   title: 'aaa'
  // });

  // ctx.log.info('abcddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');

  ctx.body = 'aaa';
  ctx.status = 200;
};


const index = async(ctx) => {
  ctx.session.count = ctx.session.count || 0
  ctx.session.count++

  ctx.session.user = "tom"+ctx.session.count;
  let sess = ctx.session ;

  ctx.body = sess;
  ctx.status = 200;
  // ctx.log.info('abc');
  //
  // let a = ctx.i18n.__('app.title');
  //
  // ctx.store.get('csrf');
  //
  // await ctx.render("home/reg.tpl", {
  //   title: a
  // });

};


const testI18n = (ctx) => {
  let title = ctx.i18n.__('app.title');
  ctx.body = title;
  ctx.status = 200;
};


const testLogger = (ctx) => {
  throw new Error('test error handler');

  let j = {
    username: 'aaaaaaaa',
    blog: 'sssssssssssss',
    age: 20,
    text: "aaaaaaaaaaaaaaaaaaaaaa"
  };
  ctx.log.error(j, 'abc');
  //ctx.log.warn(j,'abc');
  //ctx.log.info('this is infoss');

  ctx.status = 200;
};

const testRedis = async(ctx) => {
  if (ctx.redis) {
    await ctx.redis.set('foo', 'hello2');
    let a = await ctx.redis.get('foo');
    ctx.body = a;
  }
  ctx.status = 200;
};

const testMongo = async(ctx) => {
  if (ctx.mongo) {
    let catModel = Cat.make(ctx.mongo);
    var kitty = new catModel({
      name: 'Zildjian',
      friends: ['tom', 'jerry']
    });
    kitty.age = 5;

    kitty.save().then((doc) => {
      //console.log(doc)
    });

    let query = await catModel.findOne({
      name: "Zildjian"
    }).exec();
    //console.log(query);

    ctx.body = query;
  }
  ctx.status = 200;
};

const testDB = async(ctx) => {
  let userModel = User.make(ctx.db);

  let rs = await userModel.findById('111');
  ctx.status = 200;
};

const testTemplate = async(ctx) => {
  await ctx.render("home/reg.tpl", {
    title: 'hello'
  });
};

const testAntd = async(ctx) => {
  await ctx.render('home/list.tpl');
};

const reg = async(ctx) => {
  await ctx.render("home/reg.tpl", {
    title: "reg"
  });
};

export default {
  index,
  testAll,
  testI18n,
  testLogger,
  testRedis,
  testMongo,
  testDB,
  testTemplate,
  testAntd,
  reg
};
