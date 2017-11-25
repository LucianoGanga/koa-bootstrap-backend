'use strict'

const RestaurantsModel = require('models/restaurant')

const restaurants = require('test/mocks/restaurants')

module.exports = async function () {
  await RestaurantsModel.create(restaurants)
}
