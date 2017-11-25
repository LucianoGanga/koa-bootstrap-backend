'use strict'

const httpStatus = require('http').STATUS_CODES
const logError = require('./logError')

module.exports = async function errorHandler (ctx, next) {
  try {
    await next()

    if (ctx.status === 404) {
      switch (ctx.accepts('text', 'json')) {
        case 'text':
          // We need to explicitly set 404 here so that koa doesn't assign 200 on body=
          ctx.status = 404
          ctx.body = 'Not found'
          break
        case 'json':
          // We need to explicitly set 404 here so that koa doesn't assign 200 on body=
          ctx.status = 404
          ctx.body = {
            message: 'Not found'
          }
          break
      }
    }
  } catch (err) {
    const statusCode = err.status && httpStatus[err.status] ? err.status : 500

    ctx.status = statusCode
    ctx.body = {
      error: err.name,
      message: err.message
    }

    logError(err, statusCode)
  }
}
