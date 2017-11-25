'use strict'

const Restaurant = require('classes/Restaurant')

/**
 * List Restaurants according to the given parameters
 * @test test/unit/controllers/restaurant/list.test.js
 */
module.exports = async function list (ctx) {
  const ratingMin = typeof ctx.query.ratingMin !== 'undefined' ? ctx.query.ratingMin : 1
  const ratingMax = typeof ctx.query.ratingMax !== 'undefined' ? ctx.query.ratingMax : 5
  // Prepare the filter
  const filter = {
    rating: {
      $gte: ratingMin,
      $lte: ratingMax
    }
  }

  // Validations
  if (ratingMin > 5 || ratingMin < 1) {
    const error = new Error(`Invalid value provided for parameter "ratingMin"`)
    error.code = 'INVALID_ARGUMENT'
    error.message = 'The value of ratingMin must be between 1 and 5'
    throw error
  }
  if (ratingMax > 5 || ratingMax < 1) {
    const error = new Error(`Invalid value provided for parameter "ratingMax"`)
    error.code = 'INVALID_ARGUMENT'
    error.message = 'The value of ratingMax must be between 1 and 5'
    throw error
  }
  if (ratingMax < ratingMin) {
    const error = new Error(`Invalid values provided for parameters "ratingMin" and "ratingMax"`)
    error.code = 'INVALID_ARGUMENT'
    error.message = '"ratingMax" must be greater than "ratingMin"'
    throw error
  }

  if (ctx.params && ctx.params.restaurantId) {
    const restaurant = await Restaurant.findById(ctx.params.restaurantId)
    if (restaurant) {
      ctx.body = restaurant.raw()
    } else {
      ctx.status = 404
    }
  } else {
    // Get the restaurants
    const restaurants = await Restaurant.find(filter)
    ctx.body = restaurants.map((restaurant) => restaurant.raw())
  }
}
