/*!
 * index.js base on https://github.com/queckezz/koa-views
 * Created by Davis Cai on 2017/02/17
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 * about template benchmarks https://github.com/marko-js/templating-benchmarks
 */

'use strict'

const {resolve,dirname,extname,join} = require('path')
const consolidate = require('consolidate')
const {stat} = require('mz/fs')
const send = require('./send')

module.exports = viewsMiddleware

function viewsMiddleware(path, {
    engineSource = consolidate,
    extension = 'html',
    options = {},
    map
} = {}) {
    return function views(ctx, next) {
        if (ctx.render) return  next()

        ctx.render = async function(relPath, locals = {}) {
            extension = (extname(relPath) || '.' + extension).slice(1)
            let {rel,abs} = await getPaths(path, relPath, extension);
            const state = Object.assign(locals, options, ctx.state || {})
            ctx.type = 'text/html'
            if (isHtml(extension) && !map) {
                await send(ctx, rel, {
                    root: path
                })
            } else {
                const engineName = map && map[extension] ?
                    map[extension] :
                    extension

                const render = engineSource[engineName]
                if (!engineName || !render) return Promise.reject(new Error(
                    `Engine not found for the ".${extension}" file extension`
                ))
                let html = await render(resolve(abs, rel), state);
                ctx.body = html;
            }
        }

        return  next()
    }
}

async function getPaths(abs, rel, ext) {
    try {
        let stats = await stat(join(abs, rel));
        if (stats.isDirectory()) {
            // a directory
            return {
                rel: join(rel, toFile('index', ext)),
                abs: join(abs, dirname(rel), rel)
            }
        }
        // a file
        return {rel,abs};
    }catch(err){
        // not a valid file/directory
        if (!extname(rel)) {
            // Template file has been provided without extension
            // so append to it to try another lookup
            return getPaths(abs, `${rel}.${ext}`, ext)
        }
        throw err;
    }
}

function isHtml(ext) {
    return ext === 'html'
}

function toFile(fileName, ext) {
    return `${fileName}.${ext}`
}
