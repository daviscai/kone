'use strict'

const get = require('raw-body')
const inflate = require('inflation')

module.exports = parser

const defaults = {
  limit: '1mb',
  encoding: null,
  verify: false,
  type: 'application/octet-stream',
  detect: false
}

function parser (options) {
  options = Object.assign({}, defaults, options)

  const { limit, encoding, verify, type, detect } = options

  if (false !== verify && 'function' !== typeof verify) {
    throw new TypeError('option verify must be function')
  }

  if (false !== detect && 'function' !== typeof detect) {
    throw new TypeError('option detect must be function')
  }

  return raw

  function raw ({ req, res }, next = noop) {
    if ((detect && detect(req)) || req.is(type)) {
      const contentEncoding = req.get('content-encoding') || 'identity'
      let length = req.get('content-length')
      if (length && contentEncoding === 'identity') length = ~~length

      return get(
        inflate(req.raw, { encoding: contentEncoding }),
        { limit, length, encoding }
      )
        .then(body => {
          if (verify) verify(req, res, body, encoding)
          req.body = body
        })
        .catch(err => {
          if ('entity.too.large' === err.type) {
            err.message = `Body exceeded ${limit} limit`
          }
          throw err
        })
        .then(next)
    }

    return next()
  }

  function noop () {}
}

Object.defineProperty(parser, 'defaults', {
  configurable: true,
  enumerable: true,
  get: () => defaults
})
