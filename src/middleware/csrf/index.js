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
    tokenLookup: 'header:X-CSRF-Token',
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'TRACE'],
    // https://github.com/pillarjs/csrf#new-tokensoptions
    tokenOptions: undefined
}

function makeCSRF(options = {}) {
    options = Object.assign({}, defaults, options)

    const {
        key,
        tokenLookup,
        ignoreMethods,
        tokenOptions
    } = options

    const tokens = new Tokens(tokenOptions)

    const [via, field] = tokenLookup.split(':')

    let extractor = csrfTokenFromHeader(field)

    switch (via) {
        case 'form':
            extractor = csrfTokenFromForm(field)
            break
        case 'query':
            extractor = csrfTokenFromQuery(field)
            break
            // no default
    }

    return csrf

    async function csrf(ctx, next) {
        if (!ctx.session.secret) ctx.session.secret = await tokens.secret()

        if (!ctx.store.has(key)) ctx.store.set(key, tokens.create(ctx.session.secret))

        if (ignoreMethods.includes(ctx.req.method)) return next()

        const token = extractor(ctx)

        if (!token) return ctx.res.send(403, 'Invalid CSRF token')

        if (!tokens.verify(ctx.session.secret, token)) return ctx.res.send(403, 'Invalid CSRF token')

        return next()
    }
}

function csrfTokenFromHeader(header) {
    return getToken

    function getToken(ctx) {
        return ctx.req.get(header)
    }
}

function csrfTokenFromForm(name) {
    return getToken

    function getToken(ctx) {
        return ctx.req.body && ctx.req.body[name]
    }
}

function csrfTokenFromQuery(name) {
    return getToken

    function getToken(ctx) {
        return ctx.req.query[name]
    }
}
