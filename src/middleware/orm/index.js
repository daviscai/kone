/*!
 * index.js
 * Created by Davis Cai on 2017/03/08
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const path = require('path');
const Sequelize = require('sequelize');

const configDir = path.resolve(__dirname, '../../config');

const defaulfOptions = {
  logging: console.log,
  configFile: path.join(configDir, 'database.js')
};

module.exports = (options) => {
  options = Object.assign({}, defaulfOptions, options);
  let sequelize = null;
  let config = require(options.configFile);
  let dbcfg = {};
  const env = process.env.NODE_ENV || 'development';
  if (config) {
    dbcfg = config[env];
    //记录日志
    if (dbcfg.logging && typeof options.logging === 'function') {
      dbcfg.logging = options.logging;
    }
    sequelize = new Sequelize(dbcfg.database, dbcfg.username, dbcfg.password, dbcfg)
  } else {
    console.log("Database config not found ");
  }

  return async(ctx, next) => {
    let db = Object.assign({});
    db.sequelize = sequelize
    db.Sequelize = Sequelize

    ctx.db = db;
    await next();
  }
}
