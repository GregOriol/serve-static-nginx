/*!
 * serve-static-nginx
 * Copyright(c) 2021 Greg ORIOL
 *
 * inspired by serve-static (https://github.com/expressjs/serve-static)
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var parseUrl = require('parseurl')
var fs = require('fs')

/**
 * Module exports.
 * @public
 */

module.exports = serveStaticNginx

/**
 * @param {string} root
 * @param {string }nginxLocation
 * @param {object} [options]
 * @return {function}
 * @public
 */

function serveStaticNginx (root, nginxLocation, options) {
  if (!root) {
    throw new TypeError('root path required')
  }

  if (typeof root !== 'string') {
    throw new TypeError('root path must be a string')
  }

  if (!nginxLocation) {
    throw new TypeError('nginx location required')
  }

  if (typeof nginxLocation !== 'string') {
    throw new TypeError('nginx location must be a string')
  }

  // copy options object
  var opts = Object.create(options || null)

  // headers listener
  var setHeaders = opts.setHeaders

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function')
  }

  return function serveStaticNginx (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }

    // var originalUrl = parseUrl.original(req)
    var path = parseUrl(req).pathname

    fs.stat(root + path, function onstat (err, stat) {
      if (err && err.code === 'ENOENT') {
        // not found
        return next()
      }

      res.statusCode = 200
      res.setHeader('X-Accel-Redirect', nginxLocation + path)
      if (setHeaders) {
        setHeaders(res, path, stat)
      }
      res.end('')
    })
  }
}
