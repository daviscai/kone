//import models from '../models/index';
const User = require('../models/user');
const Cat = require('../models/cat');


class Home {

  async testAll(ctx) {
    // ctx.session.user = "tom3";
    // let sess = ctx.session;
    // //console.log('session:'+sess);

    // let a = ctx.i18n.__('app.title');
    // //console.log('title:'+a);

    // let csrf = ctx.store.get('csrf');
    // //console.log('csrf:'+csrf);

    // if (ctx.redis) {
    //   await ctx.redis.set('foo', 'hello2');
    //   let a = await ctx.redis.get('foo');
    //   //console.log('redis:'+a);
    // }

    // if (ctx.mongo) {
    //   let catModel = Cat.make(ctx.mongo);
    //   var kitty = new catModel({
    //     name: 'Zildjian',
    //     friends: ['tom', 'jerry']
    //   });
    //   kitty.age = 5;

    //   kitty.save().then((doc) => {
    //     //console.log(doc)
    //   });

    //   let query = await catModel.findOne({
    //     name: "Zildjian"
    //   }).exec();
    //   //console.log(query);
    // }

    // let userModel = User.make(ctx.db);
    // let rs = await userModel.findById('111');
    //console.log('mysql:'+rs);

    await ctx.render("home/index.tpl", {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      title: 'aaa'
    });

    // ctx.log.info('abcddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');

    //ctx.body = 'aaa';
    //ctx.status = 200;
  }


  async index(ctx) {
    ctx.session.count = ctx.session.count || 0
    ctx.session.count++

    ctx.session.user = "tom" + ctx.session.count;
    let sess = ctx.session;

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

  }


  testI18n(ctx) {
    let title = ctx.i18n.__('app.title');
    ctx.body = title;
    ctx.status = 200;
  }


  testLogger(ctx) {
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
  }

  async testRedis(ctx) {
    if (ctx.redis) {
      await ctx.redis.set('foo', 'hello2');
      let a = await ctx.redis.get('foo');
      ctx.body = a;
    }
    ctx.status = 200;
  }

  async testMongo(ctx) {
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
  }

  async testDB(ctx) {
    let userModel = User.make(ctx.db);

    let rs = await userModel.findById('111');
    ctx.status = 200;
  }

  async testTemplate(ctx) {
    await ctx.render("home/reg.tpl", {
      title: 'hello'
    });
  }

  async testAntd(ctx) {
    await ctx.render('home/list.tpl');
  }

  async reg(ctx) {
    await ctx.render("home/reg.tpl", {
      title: "reg"
    });
  }
}

module.exports = Home;
