import React from 'react';
//import ReactDOM from 'react-dom';
import fs from 'fs';
//import Redis from 'ioredis';
import { renderToString } from 'react-dom/server';
import Articles from '../components/article.jsx';
import { DatePicker } from 'antd';

//import models from '../models/index';

const index = async (ctx) => {
  const prerenderHtml = await renderToString(
    <Articles  />
  );

  /*
  let redis = new Redis(6380);
  redis.set('foo','hello2');
  redis.get('foo').then((rs)=>{
    console.log(rs);
  });
  */


  /*
  var redis = new Redis.Cluster([
    {port: 7000,host: '127.0.0.1'},
    {port: 7001,host: '127.0.0.1'},
    {port: 7002,host: '127.0.0.1'},
    {port: 7003,host: '127.0.0.1'},
    {port: 7004,host: '127.0.0.1'},
    {port: 7005,host: '127.0.0.1'}
  ]);

  redis.on('error',(err)=>{
    console.log('node error', err.lastNodeError);
  });

  redis.set('foo', 'bar');
  redis.get('foo', function (err, res) {
    //console.log(res);
  });
  */

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

  //ReactDOM.render(<DatePicker />, mountNode);

  const datePickerHtml = await renderToString(
    <DatePicker  />
  );


  //await models.User.findById('111');
  const readme = await fs.readFileSync('README.md', 'utf8');

  const locals = {
    readme : readme,
    //__INITIAL_STATE__: JSON.stringify({ username: this.session.username}),
    datePicker: datePickerHtml
  };
  await ctx.render('home/about', locals);
};

export default {
  index,
  reg,
  getList,
  about
};
