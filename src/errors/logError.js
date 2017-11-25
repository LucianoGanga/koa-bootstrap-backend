'use strict'

const winston = require('winston')
const httpStatus = require('http').STATUS_CODES

module.exports = function logError (err, httpStatusCode) {
  // Convert the error into a JSON, so it can be passes as metadata to winston
  const errorData = err instanceof Error ? err.toJSON() : { message: err }

  if (httpStatusCode) {
    // Add httpStatus information to the error
    errorData.httpStatusMsg = httpStatus[httpStatusCode]
    errorData.httpStatusCode = httpStatusCode
  }

  // Little hack to set the original stacktrace, by removing the error name and
  // error message (so it's not repeated in the stack's text)
  if (errorData.stack) {
    const stack = errorData.stack.split('\n')
    stack.shift()
    errorData.stack = '\n' + stack.join('\n')
  }

  // Prepare a complete message for the log
  const errorMessage = errorData.name ? `${errorData.name}: ${errorData.message}` : errorData.message

  const isWarning = httpStatusCode && httpStatusCode < 500
  try {
    winston.log(isWarning ? 'warn' : 'error', errorMessage, errorData)
  } catch (error) {
    const logErrorMessage = 'An error occurred when trying to log: ' + errorMessage
    winston.log('error', logErrorMessage, error)
  }
}

/**
 * Monkey-patch to add toJSON method on the Error object
 * @see http://stackoverflow.com/a/18391400
 */
if (!Error.prototype.toJSON) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      const alt = {}
      const props = Object.getOwnPropertyNames(this)
      const len = props.length > 50 ? 50 : props.length

      props.slice(0, len).forEach(function eachProp (key) {
        // Escape promises! To avoid problems while logging
        if (this[key] instanceof Promise) {
          alt[key] = '[object Promise]'
        } else {
          alt[key] = this[key]
        }
      }, this)

      return alt
    },
    configurable: true
  })
}
