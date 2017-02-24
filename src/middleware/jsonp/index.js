/*!
 * jsonp.js
 * base on koa-jsonp @https://github.com/kilianc/koa-jsonp
 * Created by Davis Cai on 2017/02/04
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'


const JSONPStream = require('./jsonp-stream');

module.exports = function jsonp(options) {
    options = options || {} ;

    let domain = options.domain || '';
    let callbackName = options.callbackName || 'callback';
    let iframeHtmlTemplate = [
        '<!doctype html><html><head><meta http-equiv="Content-Type" content="text/html charset=utf-8"/><script type="text/javascript">document.domain = "' + domain + '";parent.',
        '(',
        ');</script></head><body></body></html>'
    ];

    return  function _jsonp(ctx, next) {

        let startChunk, endChunk ;
        let callback = ctx.query[callbackName] ;
        if (ctx.body == null || !callback) return next();

        if (ctx.req.method === 'POST') {
            ctx.res.set('content-type', 'text/html');
            startChunk = iframeHtmlTemplate[0] + callback + iframeHtmlTemplate[1] ;
            endChunk = iframeHtmlTemplate[2] ;
        } else {
            ctx.res.set('content-type', 'text/javascript');
            startChunk = callback + '(' ;
            endChunk = ');' ;
        }

        // 禁用浏览器的类型猜测 , see https://imququ.com/post/web-security-and-response-header.html
        ctx.res.set('X-Content-Type-Options', 'nosniff');

        // handle streams
        if ( typeof ctx.body.pipe === 'function') {
            ctx.body = ctx.body.pipe(new JSONPStream({
                startChunk: startChunk,
                endChunk: endChunk
            })) ;
        } else {
            ctx.body = startChunk + JSON.stringify(ctx.body, null, '') + endChunk ;

            // JSON parse vs eval fix. https://github.com/rack/rack-contrib/pull/37
            ctx.body = ctx.body
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029') ;
        }
    }
}
