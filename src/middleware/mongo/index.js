/*!
 * index.js
 * Created by Davis Cai on 2017/03/08
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict';

const Promise = require('bluebird')
const Mongoose = require('mongoose');
Mongoose.Promise = Promise; // http://mongoosejs.com/docs/promises.html

const defaulfOptions = {
  host: 'localhost',
  port: 27017,
  db: 'test',
  multmongos: [], // Multi-mongos support ['host1:port1','host2:port2']
  user: '',
  pass: ''
  //server: { poolSize: 4 }
  //replset: { poolSize: 4 }
};

function mongo(options) {
  options = Object.assign({}, defaulfOptions, options);
  let mongoUrl = options.uri || options.url;
  let hostport = `${options.host}:${options.port}`;
  if (options.multmongos.length > 0) {
    hostport = options.multmongos.join(',');
  }
  if (!mongoUrl) {
    if (options.user && options.pass) {
      mongoUrl = `mongodb://${options.user}:${options.pass}@${hostport}/${options.db}`;
    } else {
      mongoUrl = `mongodb://${hostport}/${options.db}`;
    }
  }

  let opts = options;
  delete opts.host;
  delete opts.port;
  delete opts.db;
  let isConnected = false;
  let mongoConnect = Mongoose.createConnection(mongoUrl, opts, function(err) {
    // Check error in initial connection. There is no 2nd param to the callback.
    if (err) {
      console.log("connection error: " + err);
    } else {
      isConnected = true;
    }
  });

  return async function koaMongo(ctx, next) {
    ctx.mongo = isConnected ? mongoConnect : false;
    await next();
  };
}

module.exports = mongo;
