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

const defaulfOptions = {
    safe: true,
    name: '',
    serializers: {},
    // serializers: {
    //     req: Pino.stdSerializers.req,
    //     res: Pino.stdSerializers.res
    // },
    timestamp: true,
    slowtime: false,
    extreme: false, // cannot enable pretty print in extreme mode
    prettyPrint: true,
    enabled: true,
    logDir: '',
};

function logger(opts) {
    opts = Object.assign({}, defaulfOptions, opts);
    let logDir = opts.logDir || '';

    fs.mkdir(logDir).then(function() {

    }).catch(() => {

    });

    return function(ctx, next) {

        if (logDir) {
            // let newPino = wrap(pino, logDir);
            // ctx.log = newPino;

            let logFile = path.join(logDir, 'info.log');
            let stream = fs.createWriteStream(logFile);
            let pino = Pino(opts, stream);
            ctx.log = pino;
        } else {
            let pino = Pino(opts);
            ctx.log = pino;
        }

        return next()
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
