'use strict'

const Order = require('classes/Order')
const Restaurant = require('classes/Restaurant')
const moment = require('moment')
const winston = require('winston')

/**
 * Places an order in the Restaurant with the given ID
 * @test test/unit/controllers/order/place.test.js
 */
module.exports = async function place (ctx) {
  const restaurantId = ctx.params.restaurantId

  // Validations
  if (!restaurantId) {
    const error = new Error(`Missing parameter in URL`)
    error.missingParameters = [ 'restaurantId' ]
    error.code = 'MISSING_PARAMETER'
    throw error
  }

  const orderData = ctx.request.body

  // Get the Restaurant passed in the URL
  const restaurant = await Restaurant.findById(restaurantId)

  // If the requested Restaurant is not found, return 404
  if (!restaurant) {
    ctx.status = 404
    return
  }

  // Create the order
  const order = await Order.create(orderData, restaurant)

  // Get the ETA
  const eta = await order.getEta()

  // Queue the SMS with the confirmation for the Order owner
  winston.info(`Queuing messages for the new order`)
  await queueMessage('notifications', {
    medium: 'sms',
    recipient: order.phone,
    type: 'confirmation',
    data: {
      eta: moment(eta).fromNow()
    }
  })

  // Queue the E-Mail with the new order for the Restaurant
  await queueMessage('notifications', {
    medium: 'email',
    recipient: restaurant.commercialEmail,
    type: 'newOrder',
    data: {
      meals: restaurant.meals
    }
  })

  ctx.body = eta
}
