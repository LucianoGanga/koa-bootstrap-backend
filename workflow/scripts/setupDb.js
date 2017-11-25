'use strict'

const config = require('config')
const OrderModel = require('models/order')
const RestaurantModel = require('models/restaurant')
const winston = require('winston')

const Promise = require('bluebird')
const mongoose = require('mongoose')

const mockupRestaurants = require('./mockupRestaurants')

// Make mongoose use bluebird promises instead of mpromise (they're better...)
mongoose.Promise = Promise

// Wire event listeners
mongoose.connection.on('error', (err) => {
  winston.error(`[Mongo] Connection error: ${err.message}`)
})

module.exports = async function () {
  // winston.info(`Setting up DB for testing on ${config.MONGO}...`)
  // Connect to the DB
  await initMongoose(config.MONGO, true)

  // winston.info(`Cleaning up DB...`)
  // Clean up the DB
  await OrderModel.remove()
  await RestaurantModel.remove()

  // Fill the Restaurants collection
  // winston.info(`Filling up the DB with fresh data...`)
  await mockupRestaurants()

  // winston.info(`DB update done!`)
  return true
}

function connectWithRetry (connectionString) {
  return mongoose
    .connect(connectionString, {
      useMongoClient: true
    })
    .catch((reason) => {
      winston.error('[Mongo] Failed to connect. Retrying in 5 seconds.')
      return Promise.delay(5000).then(connectWithRetry.bind(this, connectionString))
    })
}

async function initMongoose (connectionString) {
  return connectWithRetry(connectionString)
}
