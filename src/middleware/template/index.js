/*!
 * index.js base on https://github.com/queckezz/koa-views
 * Created by Davis Cai on 2017/02/17
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 * about template benchmarks https://github.com/marko-js/templating-benchmarks
 *
 * async/await 性能比 Promise 差较多，改用 Promise 方式
 */

'use strict'

const {
    resolve,
    dirname,
    extname,
    join
} = require('path')
const consolidate = require('consolidate')
const {
    stat
} = require('mz/fs')
const send = require('./send')

module.exports = viewsMiddleware

function viewsMiddleware(path, {
    engineSource = consolidate,
    extension = 'html',
    options = {},
    map
} = {}) {
    return function views(ctx, next) {
        if (ctx.render) return next()

        ctx.render = function(relPath, locals = {}) {
            const suffix = (extname(relPath) || '.' + extension).slice(1)

            return getPaths(path, relPath, suffix)
                .then((paths) => {
                    const state = Object.assign(locals, options, ctx.state || {})
                    // deep copy partials
                    state.partials = Object.assign({}, options.partials || {})
                    ctx.res.type = 'text/html'

                    if (isHtml(suffix) && !map) {
                        return send(ctx, paths.rel, {
                            root: path
                        })
                    } else {
                        const engineName = map && map[suffix] ?
                            map[suffix] :
                            suffix

                        const render = engineSource[engineName]

                        if (!engineName || !render) return Promise.reject(new Error(
                            `Engine not found for the ".${extension}" file extension`
                        ))

                        return render(resolve(paths.abs, paths.rel), state)
                            .then((html) => {
                                ctx.body = html
                            })
                    }
                })
        }

        return next()
    }
}

function getPaths(abs, rel, ext) {
    return stat(join(abs, rel)).then((stats) => {
        if (stats.isDirectory()) {
            // a directory
            return {
                rel: join(rel, toFile('index', ext)),
                abs: join(abs, dirname(rel), rel)
            }
        }

        // a file
        return {
            rel,
            abs
        }
    })
    .catch((e) => {
        // not a valid file/directory
        if (!extname(rel)) {
            // Template file has been provided without extension
            // so append to it to try another lookup
            return getPaths(abs, `${rel}.${ext}`, ext)
        }

        throw e
    })
}

function isHtml(ext) {
    return ext === 'html'
}

function toFile(fileName, ext) {
    return `${fileName}.${ext}`
}
