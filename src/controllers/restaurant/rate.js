'use strict'

const Restaurant = require('classes/Restaurant')

/**
 * Rates the restaurant of the given ID, and adds the review
 * @test test/unit/controllers/restaurant/rate.test.js
 */
module.exports = async function rate (ctx) {
  const restaurantId = ctx.params.restaurantId
  const review = ctx.request.body
  // Validations
  if (!restaurantId) {
    const error = new Error(`Missing parameter in URL`)
    error.missingParameters = [ 'restaurantId' ]
    error.code = 'MISSING_PARAMETER'
    throw error
  }

  if (review.rating > 5 || review.rating < 1) {
    const error = new Error(`Invalid value provided for parameter "rating"`)
    error.arguments = [ review ]
    error.code = 'INVALID_ARGUMENT'
    error.message = 'The value of rating must be between 1 and 5'
    throw error
  }
  const restaurant = await Restaurant.findById(restaurantId)

  if (!restaurant) {
    ctx.status = 404
  } else {
    const newRating = await restaurant.rate(review)
    ctx.body = newRating
  }
}
