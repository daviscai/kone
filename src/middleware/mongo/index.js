'use strict';

const Promise = require('bluebird')
const Mongoose = require('mongoose');
Mongoose.Promise = Promise; // http://mongoosejs.com/docs/promises.html

const defaulfOptions = {
    host: 'localhost',
    port: 27017,
    db: 'test',
    user: '',
    pass: ''
    //server: { poolSize: 4 }
    //replset: { poolSize: 4 }
};

function mongo(options) {
    options = Object.assign({}, defaulfOptions, options);
    let mongoUrl = options.uri || options.url;
    if (!mongoUrl) {
        if (options.user && options.pass) {
            mongoUrl = `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}/${options.db}`;
        } else {
            mongoUrl = `mongodb://${options.host}:${options.port}/${options.db}`;
        }
    }

    let opts = options;
    delete opts.host;
    delete opts.port;
    delete opts.db;
    let mongoConnect = false;
    mongoConnect = Mongoose.createConnection(mongoUrl, opts, function(err) {
        // Check error in initial connection. There is no 2nd param to the callback.
        if(err){
            console.log("connection error: " + err);
        }
    });

    return async function koaMongo(ctx, next) {
        ctx.mongo = mongoConnect;
        await next();
    };
}

module.exports = mongo;
