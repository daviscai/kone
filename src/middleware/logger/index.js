/*!
 * index.js
 * Created by Davis Cai on 2017/02/11
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const fs = require('mz/fs')
const path = require('path')
const Pino = require('pino')

module.exports = logger

/*
 @param opts = {
  safe: true,
  name: undefined,
  serializers: {},
  timestamp: true,
  slowtime: false,
  extreme: false,
  level: 'info',
  levelVal: undefined,
  prettyPrint: false,
  enabled: true,
  logDir: '',
  logFileName: ''
}
 */
function logger(opts) {
    opts = opts || {} ;
    let logDir = opts.logDir || '';
    let logFileName = opts.logFileName || '';
    let stream = null;
    return async function (ctx, next) {

        try {
            let stats = await fs.stat(logDir);
            if(!stats.isDirectory()){
                await fs.mkdir(logDir);
            }
        } catch (err) {
            if(err.code === 'ENOENT'){
                await fs.mkdir(logDir);
            }else{
                return next()
            }
        }

        if(logFileName){
            let logFile = path.join(logDir, logFileName);
            stream = stream ||  fs.createWriteStream(logFile);
            ctx.log = Pino(stream);
        }else{
            ctx.log = Pino(opts);
        }

        return next()
    }
}

// // overriding `onerror` is much faster that using try/catch
// function catchErr(ctx, handler) {
//     return function(e) {
//         if (!e) {
//             return handler(e)
//         }
//         ctx.log.error({
//             res: ctx.res,
//             err: {
//                 type: e.constructor.name,
//                 message: e.message,
//                 stack: e.stack
//             },
//             responseTime: ctx.res.responseTime
//         }, 'request errored')
//         return handler(e)
//     }
// }
