/*!
 * send.js
 * base on koa-send @https://github.com/koajs/send
 * Created by Davis Cai on 2017/02/13
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

const Path = require('path')
const fs = require('mz/fs')
const resolvePath = require('resolve-path');
const normalize = Path.normalize;
const basename = Path.basename;
const extname = Path.extname;
const resolve = Path.resolve;
const parse = Path.parse;
const sep = Path.sep;

module.exports = async function(ctx, path, opts) {
  opts = opts || {};
  let root = opts.root ? normalize(resolve(opts.root)) : '';
  let trailingSlash = '/' == path[path.length - 1];
  path = path.substr(parse(path).root.length);
  let index = opts.index;
  let maxage = opts.maxage || opts.maxAge || 0;
  let hidden = opts.hidden || false;
  let format = opts.format === false ? false : true;
  let extensions = Array.isArray(opts.extensions) ? opts.extensions : false;
  let gzip = opts.gzip === false ? false : true;
  let setHeaders = opts.setHeaders;

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function')
  }

  let encoding = ctx.req.acceptsEncodings('gzip', 'deflate', 'identity');

  // normalize path
  path = decode(path);

  if (-1 == path) return ctx.throw('failed to decode', 400);

  // index file support
  if (index && trailingSlash) path += index;

  path = resolvePath(root, path);

  // hidden file support, ignore
  if (!hidden && isHidden(root, path)) return;

  //serve gzipped file when possible
  if (encoding === 'gzip' && gzip && (await fs.exists(path + '.gz'))) {
    path = path + '.gz';
    ctx.res.set('Content-Encoding', 'gzip');
    ctx.res.removeHeader('Content-Length');
  }

  if (extensions && !/\..*$/.exec(path)) {
    var list = [].concat(extensions);
    for (var i = 0; i < list.length; i++) {
      var ext = list[i];
      if (typeof ext !== 'string') {
        throw new TypeError('option extensions must be array of strings or false');
      }
      if (!/^\./.exec(ext)) ext = '.' + ext;
      if (await fs.exists(path + ext)) {
        path = path + ext;
        break;
      }
    }
  }

  // stat
  try {
    var stats = await fs.stat(path);

    // Format the path to serve static file servers
    // and not require a trailing slash for directories,
    // so that you can do both `/directory` and `/directory/`
    if (stats.isDirectory()) {
      if (format && index) {
        path += '/' + index;
        stats = await fs.stat(path);
      } else {
        return;
      }
    }
  } catch (err) {
    var notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];
    if (~notfound.indexOf(err.code)) return;
    err.status = 500;
    throw err;
  }

  if (setHeaders) setHeaders(ctx.res, path, stats);

  // stream
  ctx.res.set('Content-Length', stats.size);
  if (!ctx.res.get('Last-Modified')) ctx.res.set('Last-Modified', stats.mtime.toUTCString());
  if (!ctx.res.get('Cache-Control')) ctx.res.set('Cache-Control', 'max-age=' + (maxage / 1000 | 0));
  ctx.res.set('content-type', type(path));
  ctx.body = fs.createReadStream(path);

  return path;

}

/**
 * Check if it's hidden.
 */

function isHidden(root, path) {
  path = path.substr(root.length).split(sep);
  for (var i = 0; i < path.length; i++) {
    if (path[i][0] === '.') return true;
  }
  return false;
}

/**
 * File type.
 */

function type(file) {
  return extname(basename(file, '.gz'));
}

/**
 * Decode `path`.
 */

function decode(path) {
  try {
    return decodeURIComponent(path);
  } catch (err) {
    return -1;
  }
}
