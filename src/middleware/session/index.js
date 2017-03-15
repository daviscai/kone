/*!
 * index.js base on https://github.com/longztian/koa-session-minimal
 * Created by Davis Cai on 2017/02/16
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */
 
'use strict'

const uid = require('uid-safe')
const deepEqual = require('deep-equal')

const ONE_DAY = 24 * 3600 * 1000 // one day in milliseconds

const cookieOpt = (cookie) => {
  const options = Object.assign({
    maxAge: 0, // default to use session cookie
    path: '/',
    httpOnly: true,
  }, cookie || {}, {
    overwrite: true, // overwrite previous session cookie changes
    signed: false, // disable signed option
  })
  if (!(options.maxAge >= 0)) options.maxAge = 0
  return options
}

module.exports = (options) => {
  const opt = options || {}
  const key = opt.key || 'kone:sess'
  const store = opt.store || new MemoryStore()
  const cookie = opt.cookie instanceof Function ? opt.cookie : cookieOpt(opt.cookie)

  return async (ctx, next) => {
    // initialize session id and data
    const cookieSid = ctx.cookies.get(key)

    let sid = cookieSid
    if (!sid) {
      sid = uid.sync(24)
      ctx.session = {}
    } else {
      ctx.session = await store.get(`${key}:${sid}`)
      cleanSession(ctx)
    }

    const sessionClone = JSON.parse(JSON.stringify(ctx.session))

    // expose session handler to ctx
    ctx.sessionHandler = {
      regenerateId: () => {
        sid = uid.sync(24)
      },
    }

    await next()

    cleanSession(ctx)
    const sessionHasData = Object.keys(ctx.session).length > 0

    if (sid !== cookieSid) { // a new session id
      // delete old session
      if (cookieSid) deleteSession(ctx, key, cookie, store, cookieSid)

      // save new session
      saveSession(ctx, key, cookie, store, sid)
    } else { // an existing session
      // session data has not been changed
      if (deepEqual(ctx.session, sessionClone)) return

      // update / delete session
      const doSession = sessionHasData ? saveSession : deleteSession
      doSession(ctx, key, cookie, store, sid)
    }
  }
}

const deleteSession = (ctx, key, cookie, store, sid) => {
  const options = cookie instanceof Function ? cookieOpt(cookie(ctx)) : Object.assign({}, cookie)
  delete options.maxAge
  ctx.cookies.set(key, null, options)
  store.destroy(`${key}:${sid}`)
}

const saveSession = (ctx, key, cookie, store, sid) => {
  const options = cookie instanceof Function ? cookieOpt(cookie(ctx)) : cookie
  const ttl = options.maxAge > 0 ? options.maxAge : ONE_DAY
  ctx.cookies.set(key, sid, options)
  console.log(ctx.session);
  store.set(`${key}:${sid}`, ctx.session, ttl)
}

const cleanSession = (ctx) => {
  if (!ctx.session || typeof ctx.session !== 'object') ctx.session = {}
}


export class MemoryStore {
  constructor() {
    this.sessions = {} // data
    this.timeouts = {} // expiration handler
  }

  get(sid) {
    return this.sessions[sid]
  }

  set(sid, val, ttl) {
    this.sessions[sid] = val

    if (sid in this.timeouts) clearTimeout(this.timeouts[sid])
    this.timeouts[sid] = setTimeout(() => {
      delete this.sessions[sid]
      delete this.timeouts[sid]
    }, ttl)
  }

  destroy(sid) {
    if (sid in this.timeouts) {
      delete this.sessions[sid]

      clearTimeout(this.timeouts[sid])
      delete this.timeouts[sid]
    }
  }
}
