/*!
 * jsonp.js
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

    return async function _jsonp(ctx, next) {
        //const startDate = new Date();
        await next();

        return;

        let startChunk, endChunk ;
        let callback = ctx.request.query[callbackName] ;

        if (!callback) return ;
        if (ctx.response.body == null) return ;

        if (ctx.request.method === 'POST') {
            ctx.response.type = 'html' ;
            startChunk = iframeHtmlTemplate[0] + callback + iframeHtmlTemplate[1] ;
            endChunk = iframeHtmlTemplate[2] ;
        } else {
            ctx.response.type = 'text/javascript' ;
            startChunk = ';' + callback + '(' ;
            endChunk = ');' ;
        }

        // 禁用浏览器的类型猜测 , see https://imququ.com/post/web-security-and-response-header.html
        ctx.set('X-Content-Type-Options', 'nosniff');

        // handle streams
        if ( typeof ctx.response.body.pipe === 'function') {
            ctx.response.body = ctx.response.body.pipe(new JSONPStream({
                startChunk: startChunk,
                endChunk: endChunk
            })) ;
        } else {
            ctx.response.body = startChunk + JSON.stringify(ctx.response.body, null, ctx.app.jsonSpaces) + endChunk ;

            // JSON parse vs eval fix. https://github.com/rack/rack-contrib/pull/37
            ctx.response.body = ctx.response.body
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029') ;
        }

        //console.log(`method: ${ctx.method} code: ${ctx.status} time:${new Date() -startDate}ms`);

    }
}
