'use strict';

const statuses = require('statuses');
const http = require('http');
const Emitter = require('events');
const Stream = require('stream');
const Cookies = require('cookies');
const Url = require('url');
const compose = require('./compose');
const Context = require('./context');
const xssFilters = require('xss-filters');

module.exports = class Application extends Emitter {

    /**
     * Initialize a new `Application`.
     *
     * @api public
     */

    constructor() {
        super();

        //this.proxy = false;
        this.middleware = [];
        //this.subdomainOffset = 2;
        this.env = process.env.NODE_ENV || 'development';
        this.context = {};
        this.request = {};
        this.response = {};

        //this.context = new Context(this, req, res);
        // this.request = Object.create(request);
        // this.response = Object.create(response);
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
        const server = http.createServer(this.callback());
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

    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     * @api public
     */

    callback() {
        const fn = compose(this.middleware);

        return (req, res) => {
            const ctx = this.createContext(req, res);
            const onerror = err => this.onerror(res, err);
            fn(ctx).then(() => {
                this.respond(ctx);
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

        context.app = this;
        context.originalUrl = req.url;
        context.cookies = new Cookies(req, res, {
            keys: this.keys,
            secure: ''
        });

        context.ip = req.socket.remoteAddress || '';

        let query = Url.parse(req.url, true).query;
        let saftQuery = query;
        for(let param in query){
            saftQuery[param] = xssFilters.uriPathInUnQuotedAttr(query[param]);
        }
        context.query = saftQuery;

        context.path = Url.parse(req.url, true).pathname;


        return context;
    }

    /**
     * Default error handling.
     *
     * @param {Error} err
     * @api private
     */

    onerror(res, err) {
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
        if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;

        const errmsg = err.stack || err.toString();
        console.log(errmsg);
        // respond
        const code = statuses[err.status];
        const msg = err.expose ? err.message : code;
        res.status = err.status;
        res.length = Buffer.byteLength(msg);
        res.end(msg);
    }


    /**
     * Response helper.
     */

    respond(ctx) {
        // allow bypassing koa
        //if (false === ctx.respond) return;

        const res = ctx.res;
        //if (!ctx.writable) return;

        let body = ctx.body;
        const code = ctx.status;

        // ignore body
        if (statuses.empty[code]) {
            // strip headers
            ctx.body = null;
            return res.end();
        }

        if ('HEAD' == ctx.req.method) {
            // if (!res.headersSent && this.isJSON(body)) {
            //     ctx.length = Buffer.byteLength(JSON.stringify(body));
            // }
            return res.end();
        }

        // status body
        if (null == body) {
            body = ctx.message || String(code);
            // if (!res.headersSent) {
            //     ctx.type = 'text';
            //     ctx.length = Buffer.byteLength(body);
            // }
            return res.end(body);
        }

        // responses
        if (Buffer.isBuffer(body)) return res.end(body);
        if ('string' == typeof body) return res.end(body);
        // res.raw is http response
        if (body instanceof Stream) return body.pipe(res.raw);

        // body: json
        body = JSON.stringify(body);
        if (!res.headersSent) {
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
