'use strict'

const Restaurant = require('classes/Restaurant')

/**
 * Deletes the restaurant of the given ID
 * @test test/unit/controllers/restaurant/delete.test.js
 */
module.exports = async function deleteRestaurant (ctx) {
  const restaurantId = ctx.params.restaurantId

  // Validations
  if (!restaurantId) {
    const error = new Error(`Missing parameter in URL`)
    error.missingParameters = [ 'restaurantId' ]
    error.code = 'MISSING_PARAMETER'
    throw error
  }

  try {
    const deleteResult = await Restaurant.deleteOne(restaurantId)
    // TODO: Return different status codes based on the operation result
    ctx.body = deleteResult
  } catch (err) {
    throw err
  }
}
