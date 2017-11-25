'use strict'

const logError = require('errors/logError')

module.exports = function logUnhandledRejections () {
  // Log unhandled rejections
  process.on('unhandledRejection', (rejection) => {
    logError(rejection)
  })
}
