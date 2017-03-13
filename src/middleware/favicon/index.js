/*!
 * index.js
 * Created by Davis Cai on 2017/02/20
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const fs = require('mz/fs');
const {resolve} = require('path');

module.exports = favicon;

function favicon(path, options) {
  options = options || {}
  path = path ? resolve(path) : __dirname + '/favicon.ico';
  let icon = '';
  let maxAge = options.maxAge == null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);

  return async(ctx, next) => {
    if ('/favicon.ico' !== ctx.path) return await next();

    if (!icon) {
      icon = await fs.readFile(path);
    }
    ctx.res.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
    ctx.res.type = 'image/x-icon';
    ctx.body = icon;
  }

}
