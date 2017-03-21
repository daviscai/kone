/*!
 * index.js
 * Created by Davis Cai on 2017/03/21
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'
 
module.exports = () => {

  return (ctx, next) => {
    if (ctx.json) return next()

    ctx.json = function(errno, msg, data) {
      if (!ctx.res.raw.headersSent) {
        let rs = {
          error: errno,
          msg: msg,
          data: data
        };
        ctx.res.type = 'text/json'
        ctx.res.send(200, JSON.stringify(rs));
        ctx.res.end();
      }
    }
    return next()
  }

}
