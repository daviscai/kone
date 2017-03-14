'use strict';

global.Promise = require('bluebird')
const Path = require('path')
const Statuses = require('statuses');
const Http = require('http');
const Http2 = require('http2');
const Emitter = require('events');
const Stream = require('stream');
const Cookies = require('cookies');
const Url = require('url');
const Compose = require('./compose');
const Context = require('./context');
const Logger = require('./logger');
const XssFilters = require('xss-filters');

const defaulfOptions = {
  logPath: Path.resolve(__dirname, '../../logs'), //日志目录
};

module.exports = class Application extends Emitter {

  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor(options) {
    super();


    options = Object.assign({}, defaulfOptions, options);

    //this.proxy = false;
    this.middleware = [];
    this.lastMiddleware = [];
    //this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = {};
    this.request = {};
    this.response = {};
    this.options = options || {};
    this.logConfig = {
      logPath: options.logPath
    };

    this.logger = new Logger(this.logConfig);
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen() {
    let server = null;
    if (this.options.key && this.options.cert) {
      server = Http2.createServer({
        key: this.options.key,
        cert: this.options.cert
      }, this.callback());
    } else {
      server = Http.createServer(this.callback());
    }
    return server.listen.apply(server, arguments);
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }


  last(fn) {
    if (typeof fn !== 'function') throw new TypeError('last middleware must be a function!');
    this.lastMiddleware.push(fn);
    return this;
  }

  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    //洋葱模型下的中间件
    const fn = Compose(this.middleware);

    if (!this.listeners('error').length) this.on('error', this.onerror);

    // async/await 性能较差
    // return async (req, res)=>{
    //     try{
    //         const ctx = this.createContext(req, res);
    //         await fn(ctx);
    //         if (this.lastMiddleware) {
    //             const last = Compose(this.lastMiddleware);
    //             await last(ctx);
    //             this.respond(ctx);
    //         } else {
    //             this.respond(ctx);
    //         }
    //     }catch(err){
    //         this.onerror(req, res, err);
    //     }
    // }

    return (req, res) => {
      const ctx = this.createContext(req, res);
      const onerror = err => this.onerror(req, res, err);
      fn(ctx).then(() => {
        if (this.lastMiddleware) {
          // 需要最后执行的中间件，比如jsonp中间件，在洋葱模型以外再添加一层，这样可以避免使用async/await，目的是为了提高性能
          // 下面是 autocannon -c 100 -d 5 压测下 Latency (ms) avg
          //
          // const app = new Kone(); // not any middleware      7.33 ~ 7.96
          // app.use(jsonp());   // middleware use async/await, 9.53 ~ 10.72 | 11.78 ~ 13.17
          // app.last(jsonp());  // not use async/await,        7.96 ~ 8.51  | 9.9   ~ 10.32

          const last = Compose(this.lastMiddleware);
          last(ctx).then(() => {
            this.respond(ctx);
          }).catch(onerror);
        } else {
          this.respond(ctx);
        }
        // if not return will get Warning see http://goo.gl/rRqMUw
        return null;
      }).catch(onerror);
    };
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */

  createContext(req, res) {
    const context = new Context(this, req, res);
    context.request = context.req;
    context.response = context.res;

    context.app = this;
    context.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: ''
    });

    context.ip = req.socket.remoteAddress || '';

    let query = Url.parse(req.url, true).query;
    let saftQuery = query;
    for (let param in query) {
      saftQuery[param] = XssFilters.uriPathInUnQuotedAttr(query[param]);
    }
    context.query = saftQuery;

    context.log = this.logger;

    context.path = Url.parse(req.url, true).pathname;

    return context;
  }

  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror(req, res, err) {

    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);



    // unset all headers, and set those specified
    res._headers = {};

    // force text/plain
    res.type = 'text';

    // ENOENT support
    if ('ENOENT' == err.code) err.status = 404;

    // default to 500
    if ('number' != typeof err.status || !Statuses[err.status]) err.status = 500;

    const errStack = err.stack || err.toString();

    // logging
    err.reqUrl = req.originalUrl;
    this.logger.error(err, 'sys');

    // respond
    //const code = Statuses[err.status];
    const msg = process.env.NODE_ENV === 'production' ? err.message : err.message + "\n" + errStack ;
    res.status = err.status;
    res.length = Buffer.byteLength(msg);
    res.end(msg);
    return null;
  }


  /**
   * Response helper.
   */

  respond(ctx) {
    if (false === ctx.res) return;

    const res = ctx.res;
    //if (!ctx.writable) return;

    let body = ctx.body;
    const code = ctx.status;

    // ignore body
    if (Statuses.empty[code]) {
      // strip headers
      ctx.body = null;
      return res.end();
    }

    if ('HEAD' == ctx.req.method) {
      if (!res.raw.headersSent && this.isJSON(body)) {
        ctx.length = Buffer.byteLength(JSON.stringify(body));
      }
      return res.end();
    }

    // status body
    if (null == body) {
      body = ctx.message || String(code);
      if (!res.raw.headersSent) {
        ctx.type = 'text';
        ctx.length = Buffer.byteLength(body);
      }
      return res.end(body);
    }

    // responses
    if (Buffer.isBuffer(body)) return res.end(body);
    if ('string' == typeof body) {
      return res.end(body);
    }
    if (body instanceof Stream) {
      // res.raw is http response
      return body.pipe(res.raw);
    }
    // body: json
    body = JSON.stringify(body);
    if (!res.raw.headersSent) {
      ctx.length = Buffer.byteLength(body);
    }
    res.end(body);
  }

  isJSON(body) {
    if (!body) return false;
    if ('string' == typeof body) return false;
    if ('function' == typeof body.pipe) return false;
    if (Buffer.isBuffer(body)) return false;
    return true;
  }
};
