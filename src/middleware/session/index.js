/*!
 * index.js base on koa-session2
 * Created by Davis Cai on 2017/02/16
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'


const uid = require('uid-safe');

export class Store {
    constructor() {
        this.session = {};
    }

    decode(string) {
        if (!string) return "";

        let session = "";

        try {
            session = new Buffer(string, "base64").toString();
        } catch (e){
            throw e;
        }

        return JSON.parse(session);
    }

    encode(obj) {
        return new Buffer(obj).toString("base64");
    }

    getID(length) {
        return uid.sync(length);
    }

    get(sid) {
        return this.decode(this.session[sid]);
    }

    set(session, opts) {
        opts = opts || {};
        let sid = opts.sid;
        if (!sid) {
            sid = this.getID(24);
        }

        this.session[sid] = this.encode(JSON.stringify(session));

        return sid;
    }

    destroy(sid) {
        delete this.session[sid];
    }
}

module.exports = function(opts = {}) {
    opts.key = opts.key || "kone:sess";
    opts.store = opts.store || new Store();

    return  function(ctx, next) {
        let id = ctx.cookies.get(opts.key, opts);

        if (!id) {
            ctx.session = {};
        } else {
            ctx.session = opts.store.get(id);
            // check session should be a no-null object
            if (typeof ctx.session !== "object" || ctx.session == null) {
                ctx.session = {};
            }
        }

        // clear old session if exists
        if (id) {
            opts.store.destroy(id);
            id = null;
        }

        // set new session
        if (ctx.session && Object.keys(ctx.session).length) {
            let sid = opts.store.set(ctx.session, Object.assign({}, opts, {
                sid: id
            }));
            ctx.cookies.set(opts.key, sid, opts);
        }

        return next();
    }
}
