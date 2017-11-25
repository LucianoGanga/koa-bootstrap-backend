'use strict'

const traverse = require('traverse')
const ObjectId = require('mongoose').Types.ObjectId

/**
 * Rewrites ObjectId instances as strings for better logging
 */
module.exports = function objectIdRewriter (level, msg, meta) {
  traverse(meta).forEach(function convert (x) {
    if (x instanceof ObjectId) {
      this.update(x.toString())
    }
  })

  return meta
}
