'use strict'

const config = require('config')

module.exports = async function status(ctx) {
  ctx.body = {
    appName: config.appName,
    status: 'running'
  }
}
