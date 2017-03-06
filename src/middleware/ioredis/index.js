/*!
 * index.js
 * Created by Davis Cai on 2017/03/06
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const path = require('path');
const Redis = require('ioredis');

const configDir = path.resolve(__dirname, '../../config');

module.exports = (opts) => {
    opts = opts || {};
    let config = {};
    if(opts.redis){
        config = opts.redis;
    }else{
        let configFile = opts.configFile ||  path.join(configDir, 'redis.js');
        config = require(configFile);
    }

    let redis = null;

    return async (ctx, next) => {
        ctx.redis = false;

        // Cluster
        if(config['redis'].length>1){
            redis = new Redis.Cluster(config['redis']);
        }else if(config['redis'].length == 1 ){
            redis = new Redis(config['redis'][0]);
        }else{
            console.log("Redis config not found ");
            return ;
        }

        redis.on('error', (err) =>{
            console.log("Redis connection error", err);
            return ;
        });
        redis.on('connect', ()=>{
            ctx.redis = redis;
        });

        await next();
    }
}
