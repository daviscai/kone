/*!
 * index.js base on https://github.com/trekjs/csrf
 * Created by Davis Cai on 2017/02/16
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

module.exports = makeCSRF

const Tokens = require('csrf')

const defaults = {
    key: 'csrf',
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'TRACE'],
    // https://github.com/pillarjs/csrf#new-tokensoptions
    tokenOptions: undefined
}

function makeCSRF(options = {}) {
    options = Object.assign({}, defaults, options)

    const {
        key,
        ignoreMethods,
        tokenOptions
    } = options

    const tokens = new Tokens(tokenOptions)

    return csrf

    async function csrf(ctx, next) {

        if (!ctx.session.secret) ctx.session.secret = await tokens.secret()

        if (!ctx.store.has(key)) ctx.store.set(key, tokens.create(ctx.session.secret))

        if (ignoreMethods.includes(ctx.req.method)) return next()

        const bodyToken = (ctx.req.body && typeof ctx.req.body._csrf === 'string') ? ctx.req.body._csrf : false;


        const token = bodyToken
            || (ctx.query && ctx.query._csrf)
            || ctx.req.get('csrf-token')
            || ctx.req.get('xsrf-token')
            || ctx.req.get('x-csrf-token')
            || ctx.req.get('x-xsrf-token');


        if (!token) return ctx.res.send(403, 'Invalid CSRF token')

        if (!tokens.verify(ctx.session.secret, token)) return ctx.res.send(403, 'Invalid CSRF token')

        return next()
    }
}
