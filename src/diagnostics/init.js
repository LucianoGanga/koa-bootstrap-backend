'use strict'

const winston = require('winston')
const _ = require('lodash')

const objectIdRewriter = require('./objectIdRewriter')

const logUnhandledRejections = require('./logUnhandledRejections')
const formatter = require('./formatter')

function initDiagnostics ({ environment, winston: winstonCfg }) {
  // Set custom colors
  winston.addColors(winstonCfg.colors)

  // Set custom levels
  winston.setLevels(winstonCfg.levels)

  // Remove the default console transport
  winston.remove(winston.transports.Console)

  if (winstonCfg.console) {
    // Set logging using the console
    const consoleCfg = _.defaults(winstonCfg.console, {})
    winston
      .add(winston.transports.Console, formatter.console(consoleCfg, winstonCfg.colors))
      .rewriters.push(objectIdRewriter)
  }

  // Set logging into the filesystem
  if (winstonCfg.file) {
    winston.add(winston.transports.File, winstonCfg.file)
  }

  /**
   * Now that logging is ready, begin logging unhandled rejections
   */
  logUnhandledRejections()
}

module.exports = {
  init: initDiagnostics
}
