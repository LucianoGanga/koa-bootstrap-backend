'use strict'

const OrderModel = require('db/models/order')

const moment = require('moment')

module.exports = class Order {
  constructor (orderData, restaurantInstance) {
    this._order = orderData
    this._restaurant = restaurantInstance
  }

  get id () {
    return this._order._id
  }

  get location () {
    return this._order.location
  }

  get restaurantLocation () {
    return this._restaurant.location
  }

  get phone () {
    return this._order.phone
  }

  /**
   * Returns the instance data in the format that the API uses
   */
  raw () {
    return JSON.parse(JSON.stringify(this._order.toJSON()))
  }

  /**
   * Creates a new Order associated to a Restaurant
   * @param {object} orderData - The data for the new order
   * @param {Restaurant} restaurant - The instance of the Restaurant associated to this order
   * @returns {Order} - The created order instance
   */
  static async create (orderData, restaurant) {
    // Add the restaurantId to the orderData
    orderData.restaurant = restaurant.id

    // Calculate the total cost
    let totalCost = 0
    orderData.meals.map((meal) => {
      const mealData = restaurant.getMealData(meal.mealId)
      totalCost += mealData.price * meal.qty
    })
    orderData.totalCost = totalCost

    // Create the Order in the DB
    const createdOrder = await OrderModel.create(orderData)

    return new Order(createdOrder, restaurant)
  }
}
