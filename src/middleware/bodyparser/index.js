'use strict'

module.exports = bodyParser

const defaults = {
  json: true,
  urlencoded: true
}

function bodyParser (options) {
  options = Object.assign({}, defaults, options)

  const enabled = Object.keys(options).filter(t => options[t])

  const parsers = enabled.map(type => bodyParser[type](options[type]))

  return parseBody

  function parseBody (ctx, next) {
    if (undefined !== ctx.req.body) return next()
    return Promise.all(parsers.map(p => p(ctx))).then(next)
  }
}

Object.defineProperties(bodyParser, {

  busboy: define(() => require('busboy')),

  defaults: define(() => defaults),

  json: define(getter('json')),

  multipart: define(getter('multipart')),

  raw: define(getter('raw')),

  text: define(getter('text')),

  urlencoded: define(getter('urlencoded'))

})

function define (get) {
  return { configurable: true, enumerable: true, get }
}

function getter (type) {
  return () => require(`./lib/${type}`)
}
