/*!
 * index.js
 * Created by Davis Cai on 2017/02/11
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const fs = require('mz/fs')
const path = require('path')
const Log4js = require('log4js')
const util = require('util');

module.exports = logger

const defaulfOptions = {
    configFile : '', //日志配置文件
};

function logger(opts) {
    opts = Object.assign({}, defaulfOptions, opts);

    const configDir = path.resolve(__dirname, '../../config');
    let configFile = opts.configFile || path.join(configDir, 'log4js.js');
    let configFileObject = require(configFile);

    // fs.mkdir(logDir).then(function() {
    //
    // }).catch(() => {
    //
    // });

    return function(ctx, next) {

        Log4js.configure(configFileObject);

        ctx.log = log;
        return next()
    }
}

const log = {

    debug : function(name, msg){

        Log4js.getLogger(name).debug(msg);
    },

    info : function(name, msg){
        Log4js.getLogger(name).info(msg);
    },

    warn : function(name, msg){
        Log4js.getLogger(name).warn(msg);
    },

    error : function(name, msg){
        Log4js.getLogger(name).error(msg);
    },

    fatal : function(name, msg){
        Log4js.getLogger(name).fatal(msg);
    }
}



//
// function wrap(pino, logDir) {
//     let methods = ['info', 'warn', 'error', 'fatal'];
//     for (let n of methods) {
//         let fn = pino[n];
//         pino[n] = function() {
//             let logFile = path.join(logDir, n + '.log');
//             let stream = fs.createWriteStream(logFile);
//             pino.stream = stream;
//             fn.apply(this, arguments);
//         }
//     }
//
//     return pino;
// }
