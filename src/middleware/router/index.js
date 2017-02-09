/*!
 * index.js
 * Created by Davis Cai on 2017/02/09
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const path  = require('path');
const configDir = path.resolve(__dirname, '../../config');

module.exports = function router(options) {
    options = options || {} ;
    let routerConfigDir = options.routerConfigDir || configDir;
    let routerFile = options.routerFile || 'router.js';

    return function (ctx) {
        let router = require(path.join(routerConfigDir, routerFile));
        let url = ctx.req.url.split('?')[0];
        let result = router.find(ctx.req.method, url);
        if (result[0]) {
            ctx.req.params = result[1];
            return result[0](ctx);
        }
    }
}
