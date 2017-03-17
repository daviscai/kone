'use strict'

const get = require('raw-body')
const inflate = require('inflation')

module.exports = parser

// Allowed whitespace is defined in RFC 7159
// http://www.rfc-editor.org/rfc/rfc7159.txt
/* eslint no-control-regex: 0 */
const FIRST_CHAR_REGEXP = /^[\x20\x09\x0a\x0d]*(\[|\{)/

const defaults = {
  limit: '1mb',
  encoding: 'utf-8',
  verify: false,
  type: [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report'
  ],
  detect: false,
  parse: JSON.parse,
  strict: true,
  reviver: undefined
}

function parser (options) {
  options = Object.assign({}, defaults, options)

  const { limit, encoding, verify, type, detect, parse, strict, reviver } = options

  if (false !== verify && 'function' !== typeof verify) {
    throw new TypeError('option verify must be function')
  }

  if (false !== detect && 'function' !== typeof detect) {
    throw new TypeError('option detect must be function')
  }

  return json

  function json ({ req, res }, next = noop) {
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

          const empty = 0 === body.length

          if (strict) {
            if (empty) return {}
            if (!FIRST_CHAR_REGEXP.test(body)) {
              throw new SyntaxError('Invalid JSON, only supports object and array')
            }
          }

          if (empty) return body

          return parse(body, reviver)
        })
        .then(body => {
          req.body = body
        })
        .catch(err => {
          if ('entity.too.large' === err.type) {
            err.message = `Body exceeded ${limit} limit`
          } else if ('SyntaxError' === err.name) {
            err.status = 400
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
