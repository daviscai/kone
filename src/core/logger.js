/*!
 * index.js
 * Created by Davis Cai on 2017/03/12
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const fs = require('mz/fs')
const path = require('path')
const stringifySafe = require('fast-safe-stringify')
const os = require('os')


const defaulfOptions = {
    logPath: path.resolve(__dirname, '../../../logs'), //日志配置文件
};


/**
 * ctx.log = Logger({
 *  logPath = '',
 *  pattern : '{"datetime":"%datetime","level":"%level","hostname":"%hostname","pid":"%pid","msg":"%msg"}',
 * });
 * ctx.log.error(msg, filename);
 */

module.exports = class Logger {
    constructor(opts) {
        opts = Object.assign({}, defaulfOptions, opts);

        this.cache = false;
        this.logPath = opts.logPath || '';
        this.stringify = stringifySafe || JSON.stringify;
        this.pattern = '{"datetime":"%datetime","level":"%level","hostname":"%hostname","pid":"%pid","msg":"%msg"}';
        this.cache = {
            size: 4096,
            buf: ''
        }

        fs.mkdir(this.logPath).then(function() {

        }).catch(() => {

        });
    }

    hostname() {
        return os.hostname().toString();
    }

    pid() {
        return process.pid;
    }

    datetime(){
        let d = new Date();
        let month = d.getMonth() + 1;
        month = month < 10 ? '0'+month : month;

        let date = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();
        let hours = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
        let minutes = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
        let seconds = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();

        return d.getFullYear()+'/'+month+'/'+date+' '+hours+':'+minutes+':'+seconds;
    }

    toJson(obj) {
        let msg = '';

        if (obj instanceof Error && obj.stack) {
            msg = ',"type":"Error","stack":' + this.stringify(obj.stack)
        } else if (typeof obj === 'object') {
            msg = this.stringify(obj);
        } else {
            msg = obj;
        }
        return msg;
    }

    replace(message, level){
        return  this.pattern.replace(/%datetime/g, this.datetime())
        .replace(/%level/g, level)
        .replace(/%hostname/g, this.hostname())
        .replace(/%pid/g, this.pid())
        .replace(/%msg/g, message);
    }

    write(msg, filename, callback) {
        let logFile = path.join(this.logPath, filename);
        fs.appendFile(logFile, msg + "\n", 'utf8', callback);

        // let buf = new BufferStore();
        // buf.set(msg + "\n");
        // // this.cache.buf += message
        // //
        // let curBufferString = buf.get();
        // console.log(curBufferString.length);
        // if (curBufferString.length >= this.cache.size) {
        //     fs.appendFile(logFile, curBufferString, 'utf8', callback);
        //     buf.destroy();
        // }
    }


    info(msg, filename, callback) {
        let logFileName = filename ? 'info_' + filename + '.log' : 'info.log';
        let message = this.toJson(msg);
        let str = this.replace(message, 'INFO');
        this.write(str, logFileName, callback);
    }

    warn(msg, filename, callback) {
        let logFileName = filename ? 'warn_' + filename + '.log' : 'warn.log';
        let message = this.toJson(msg);
        let str = this.replace(message, 'WARN');
        this.write(str, logFileName, callback);
    }

    error(msg, filename, callback) {
        let logFileName = filename ? 'error_' + filename + '.log' : 'error.log';
        let message = this.toJson(msg);
        let str = this.replace(message, 'ERROR');
        this.write(str, logFileName, callback);
    }
}

//
// export class BufferStore {
//     constructor() {
//         this.buff = new Buffer(4096);
//     }
//
//     getID() {
//         return os.hostname().toString()+'_'+process.pid;
//     }
//
//     get() {
//         return this.buff.toString();
//     }
//
//     set(message) {
//
//         //sid = this.getID();
//         this.buff.write(message);
//
//         //return sid;
//     }
//
//     destroy() {
//         this.buff = null;
//         //delete this.session[sid];
//     }
// }
