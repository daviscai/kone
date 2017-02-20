/*!
 * index.js base on https://github.com/venables/koa-helmet
 * Created by Davis Cai on 2017/02/19
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const helmet = require('helmet')

const promisifyMiddleware = function(middleware) {
    return function(req, res) {
        return new Promise(function(resolve, reject) {
            middleware(req, res, function(err) {
                if (err) {
                    return reject(err)
                }

                return resolve()
            })
        })
    }
}

const makeHelmet = function() {
    const helmetPromise = promisifyMiddleware(helmet.apply(null, arguments))

    return (ctx, next) => {
        return helmetPromise(ctx.req.raw, ctx.res.raw).then(next)
    }
}

Object.keys(helmet).forEach(function(helmetMethod) {
    makeHelmet[helmetMethod] = function() {
        const method = helmet[helmetMethod]
        const methodPromise = promisifyMiddleware(method.apply(null, arguments))

        return (ctx, next) => {
            return methodPromise(ctx.req.raw, ctx.res.raw).then(next)
        }
    }
})

module.exports = makeHelmet
