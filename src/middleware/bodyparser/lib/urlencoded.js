'use strict'

const qs = require('qs')
const get = require('raw-body')
const inflate = require('inflation')

module.exports = parser

const defaults = {
  limit: '56k',
  encoding: 'utf-8',
  verify: false,
  type: 'application/x-www-form-urlencoded',
  detect: false,
  parse: qs.parse
}

function parser (options) {
  options = Object.assign({}, defaults, options)

  const { limit, encoding, verify, type, detect, parse } = options

  if (false !== verify && 'function' !== typeof verify) {
    throw new TypeError('option verify must be function')
  }

  if (false !== detect && 'function' !== typeof detect) {
    throw new TypeError('option detect must be function')
  }

  return urlencoded

  function urlencoded ({ req, res }, next = noop) {
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
          req.body = parse(body)
        })
        .catch(err => {
          if ('entity.too.large' === err.type) {
            err.message = `Body exceeded ${limit} limit`
          }
          throw err
        })
        .then(next)
    }
  }

  function noop () {}
}

Object.defineProperty(parser, 'defaults', {
  configurable: true,
  enumerable: true,
  get: () => defaults
})
