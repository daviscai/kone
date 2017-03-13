/*!
 * index.js base on https://github.com/trekjs/cors
 * Cross-Origin Resource Sharing(CORS) middleware
 * Created by Davis Cai on 2017/02/18
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

module.exports = makeCors

const defaults = {
  credentials: false,
  origins: '*',
  methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  maxAge: 0
}

const ORIGIN = 'Origin'
const ACCESS_CONTROL_MAX_AGE = 'Access-Control-Max-Age'
const ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin'
const ACCESS_CONTROL_ALLOW_METHODS = 'Access-Control-Allow-Methods'
const ACCESS_CONTROL_ALLOW_HEADERS = 'Access-Control-Allow-Headers'
const ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers'
const ACCESS_CONTROL_ALLOW_CREDENTIALS = 'Access-Control-Allow-Credentials'

const ACCESS_CONTROL_REQUEST_METHOD = 'Access-Control-Request-Method'
const ACCESS_CONTROL_REQUEST_HEADERS = 'Access-Control-Request-Headers'

function makeCors(options = {}) {
  options = Object.assign({}, defaults, options)

  let {
    credentials,
    origins,
    methods,
    maxAge,
    headers,
    exposeHeaders
  } = options

  credentials = Boolean(credentials)

  if (Array.isArray(origins)) {
    origins = origins.join(',')
  }

  if (Array.isArray(methods)) {
    methods = methods.join(',')
  }

  if (Array.isArray(headers)) {
    headers = headers.join(',')
  }

  if (Array.isArray(exposeHeaders)) {
    exposeHeaders = exposeHeaders.join(',')
  }

  return cors

  function cors({
    req,
    res
  }, next) {
    const origin = 'origin' in req.headers

    // Simple request
    if ('OPTIONS' !== req.method) {
      res.vary(ORIGIN)

      if (!origin || !origins) return next()

      res.set(ACCESS_CONTROL_ALLOW_ORIGIN, origins)

      if (credentials) res.set(ACCESS_CONTROL_ALLOW_CREDENTIALS, 'true')

      if (exposeHeaders) res.set(ACCESS_CONTROL_EXPOSE_HEADERS, exposeHeaders)

      return next()
    }

    // Preflight request
    // Always set Vary headers
    res.vary(ORIGIN)
    res.vary(ACCESS_CONTROL_REQUEST_METHOD)
    res.vary(ACCESS_CONTROL_REQUEST_HEADERS)

    if (!origin || !origins) return next()

    res.set(ACCESS_CONTROL_ALLOW_ORIGIN, origins)

    if (methods) res.set(ACCESS_CONTROL_ALLOW_METHODS, methods)

    if (credentials) res.set(ACCESS_CONTROL_ALLOW_CREDENTIALS, 'true')

    if (maxAge > 0) res.set(ACCESS_CONTROL_MAX_AGE, maxAge)

    if (!headers) headers = req.get(ACCESS_CONTROL_REQUEST_HEADERS)

    if (headers) res.set(ACCESS_CONTROL_ALLOW_HEADERS, headers)

    return res.send(204)
  }
}
