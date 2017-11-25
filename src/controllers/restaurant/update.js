'use strict'

const Restaurant = require('classes/Restaurant')

/**
 * Updates a restaurant with the given ID, using the data provided in the body
 * @test test/unit/controllers/restaurant/update.test.js
 */
module.exports = async function update (ctx) {
  const restaurantId = ctx.params.restaurantId
  const newData = ctx.request.body

  if (!restaurantId) {
    const error = new Error(`Missing parameter in URL`)
    error.missingParameters = [ 'restaurantId' ]
    error.code = 'MISSING_PARAMETER'
    throw error
  }

  const newRestaurant = await Restaurant.updateOne(restaurantId, newData.data)
  ctx.body = newRestaurant.raw()
}
