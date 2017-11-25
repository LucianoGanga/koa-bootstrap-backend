'use strict'

const Promise = require('bluebird')
const mongoose = require('mongoose')
const winston = require('winston')

// Make mongoose use bluebird promises instead of mpromise (they're better...)
mongoose.Promise = Promise

// Wire event listeners
mongoose.connection
  .on('error', err => {
    winston.error(`[Mongo] Connection error: ${err.message}`)
  })
  .on('open', () => {
    winston.info('[Mongo] Connected')
  })
  .on('close', () => {
    winston.info('[Mongo] Closed')
  })
  .on('connecting', () => {
    winston.info('[Mongo] Connecting')
  })
  .on('disconnecting', () => {
    winston.info('[Mongo] Disconnecting')
  })
  .on('disconnected', () => {
    winston.info('[Mongo] Disconnected')
  })
  .on('reconnected', () => {
    winston.info('[Mongo] Reconnected')
  })
  .on('disconnected', () => {
    winston.error('[Mongo] Disconnected')
  })

function connectWithRetry (connectionString) {
  return mongoose.connect(connectionString, {
    useMongoClient: true
  }).catch(reason => {
    winston.error('[Mongo] Failed to connect. Retrying in 5 seconds.')
    return Promise.delay(5000).then(connectWithRetry.bind(this, connectionString))
  })
}

module.exports = {
  init: async function initMongoose (connectionString) {
    return connectWithRetry(connectionString)
  }
}
