'use strict'

const multer = require('multer')

module.exports = multipart

function multipart (options) {
  const m = multer(options)

  promisify(m, 'any')
  promisify(m, 'array')
  promisify(m, 'fields')
  promisify(m, 'none')
  promisify(m, 'single')

  return m
}

function promisify (multer, name) {
  if (!multer[name]) return

  const fn = multer[name]

  function handle (...args) {
    const middleware = fn.apply(multer, args)

    return upload

    function upload ({ req, rawReq, rawRes }, next) {
      return new Promise((resolve, reject) => {
        middleware(rawReq, rawRes, err => {
          if (err) return reject(err)

          if (rawReq.body) req.body = rawReq.body

          Object.defineProperty(req, 'file', {
            configurable: true,
            enumerable: true,
            get: () => rawReq.file
          })

          Object.defineProperty(req, 'files', {
            configurable: true,
            enumerable: true,
            get: () => rawReq.files
          })

          resolve()
        })
      }).then(next)
    }
  }

  Object.defineProperty(multer, name, {
    configurable: true,
    enumerable: true,
    get: () => handle
  })
}

Object.defineProperties(multipart, {
  diskStorage: {
    configurable: true,
    enumerable: true,
    get: () => multer.diskStorage
  },
  memoryStorage: {
    configurable: true,
    enumerable: true,
    get: () => multer.memoryStorage
  }
})
