import React from 'react';
import fs from 'fs';
import Redis from 'ioredis';
import { renderToString } from 'react-dom/server';
import Articles from '../components/article.jsx';

import models from '../models/index';

const index = async (ctx) => {
  const prerenderHtml = await renderToString(
    <Articles  />
  );

  //const author = await models.User.findById('111');

  /*
  let redis = new Redis(6380);
  redis.set('foo','hello2');
  redis.get('foo').then((rs)=>{
    console.log(rs);
  });
  */


  var redis = new Redis.Cluster([
    {port: 7000,host: '127.0.0.1'},
    {port: 7001,host: '127.0.0.1'},
    {port: 7002,host: '127.0.0.1'},
    {port: 7003,host: '127.0.0.1'},
    {port: 7004,host: '127.0.0.1'},
    {port: 7005,host: '127.0.0.1'}
  ]);
  /*
  redis.on('error',(err)=>{
    console.log("REDIS CONNECT error "+ err);
    console.log('node error', err.lastNodeError);
  });
  */
  redis.set('foo', 'bar');
  redis.get('foo', function (err, res) {
    console.log(res);
  });

  let subTitle = ctx.i18n.__('app.subtitle');
  await ctx.render("home/index.tpl", {
    title: "nunjucks engine!",
    jsx:prerenderHtml,
    csrf:ctx.csrf,
    subTitle:subTitle
  });
};

const getList = async (ctx) => {
  ctx.body = ctx;
  //this.logger(ctx.query.id);
  //console.log(ctx.query.id);
}

const reg = async (ctx) => {
  await ctx.render("home/reg.tpl", {title:"reg"});
};

const about = async (ctx) => {
  const readme = await fs.readFileSync('README.md', 'utf8');

  // const locals = {
  //   title: 'About',
  //   nav: 'about',
  //   content: readme
  // };
  ctx.body = readme;
  //await ctx.render('home/about', locals);
};

export default {
  index,
  reg,
  getList,
  about
};
