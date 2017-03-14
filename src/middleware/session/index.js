/*!
 * index.js base on koa-session2
 * Created by Davis Cai on 2017/02/16
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

export class Store extends Map {

  get (sid) {
    const sess = super.get(sid)
    if (!sess) return

    const expires = sess.cookie.expires
    if (expires && expires <= Date.now()) {
      this.delete(sid)
      return
    }

    return sess
  }

  set (sid, sess, expires) {
    super.set(sid, sess)
    // should clear old timer
    if (sess.__timer__) {
      sess.cookie.expires = new Date() + expires
      clearTimeout(sess.__timer__)
    }
    Object.defineProperty(sess, '__timer__', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: setTimeout(() => this.delete(sid), expires)
    })
  }

}

module.exports = function(opts = {}) {
  opts.key = opts.key || "kone:sess";
  let store = opts.store || new Store();


  return async function(ctx, next) {
    ctx.session = {};
    let id = ctx.cookies.get(opts.key, opts);
    if(id){
      ctx.session = store.get(id);
      //check session should be a no-null object
      if (typeof ctx.session !== "object" ||  ctx.session == null) {
        ctx.session = {};
      }
    }


    let old = JSON.stringify(ctx.session);

    await next();

    // if not changed
    if (old == JSON.stringify(ctx.session)) return;

    // set new session
    if (ctx.session && Object.keys(ctx.session).length) {
      let sid = store.set(ctx.session, Object.assign({}, opts, {
        sid: id
      }));

      if (ctx.status / 100 === 2) {
        ctx.cookies.set(opts.key, sid, opts);
      }
    }

  }
}
