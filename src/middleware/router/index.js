/*!
 * index.js
 * Created by Davis Cai on 2017/02/09
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const path = require('path');
const configDir = path.resolve(__dirname, '../../config');
const controllerDir = path.resolve(__dirname, '../../controllers');

module.exports = function router(options) {
  options = options || {};
  let routerConfigDir = options.routerConfigDir || configDir;
  let routerFile = options.routerFile || 'router.js';
  let r = require(path.join(routerConfigDir, routerFile));

  return async function(ctx, next) {

    let url = ctx.req.url.split('?')[0];

    let matchRouter = matchUrl(url, r);

    if (matchRouter) {
      let controller = matchRouter.split('.')[0];
      let action = matchRouter.split('.')[1];
      //let queryString = matchRouter.split('.')[2];

      let obj = require(path.join(controllerDir, controller));
      let cobj = new obj(ctx);

      await cobj[action](ctx);

    }else if(url === '/favicon.ico' ){
        return next();
    }else{
        ctx.res.send(500, 'Not found any controller.action')
    }

  }
}

function matchUrl(url, router) {
  url = url.substring(url.length-1) === '/' && url !== '/' ? url.substring(0, url.length-1) : url;
  // 请求的路径 === 路由规则，如： router['/upload/index'] = 'controller.index';
  if (router[url]) {
    return router[url]
  }

  // 正则匹配， router['/upload/(:num)'] = 'controller.index.id=$1';
  for (let k in router) {
    let newKey = k.replace(/:any/g, '[^/]+').replace(/:num/g, '[0-9]+');
    let regex = new RegExp("^" + newKey + "$", "gi");

    let matchArr = url.match(regex);
    if (matchArr) {
      //匹配
      var newstr = url.replace(regex, router[k]);
      return newstr
    }
  }
}
