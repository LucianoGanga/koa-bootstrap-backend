'use strict'

const RestaurantModel = require('db/models/restaurant')

const _ = require('lodash')
const winston = require('winston')

module.exports = class Restaurant {
  constructor (restaurantData) {
    this._restaurant = restaurantData
  }

  get id () {
    return this._restaurant._id
  }

  get rating () {
    return this._restaurant.rating
  }

  get location () {
    return this._restaurant.location
  }

  get meals () {
    return this._restaurant.toJSON().meals
  }

  get commercialEmail () {
    return this._restaurant.commercialEmail
  }

  /**
   * Given a mealId, gets the data for a meal in the restaurant
   * @param {ObjectId String} mealId - The mealId to get info for
   * @returns {Object} - Returns the meal object
   */
  getMealData (mealId) {
    const mealData = _.find(this.meals, (m) => {
      return m._id.toString() === mealId.toString()
    })

    if (!mealData) {
      const error = new Error(`Couldn't find the given mealId in the Restaurant"`)
      error.restaurant = this.id
      error.mealId = mealId
      error.currentRestaurantMeals = this.meals
      throw error
    }

    return mealData
  }

  /**
   * Updates the restaurant information in the DB
   * @param {object} newData - The data to update
   * @returns {Restaurant} - The updated Restaurant instance
   */
  async update (newData) {
    this._restaurant = await RestaurantModel.findByIdAndUpdate(
      this.id,
      {
        $set: newData
      },
      {
        new: true
      }
    )

    return this
  }
  /**
   * Returns the instance data in the format that the API uses
   */
  raw () {
    return JSON.parse(JSON.stringify(this._restaurant.toJSON()))
  }

  /**
   * Finds a set of restaurants matching certain filter
   * @param {*} filter - DB Filter
   * @returns {[Restaurant]} - Array of instances of Restaurant
   */
  static async find (filter) {
    const restaurants = await RestaurantModel.find(filter).exec()
    return restaurants.map((restaurantData) => new Restaurant(restaurantData)) || []
  }

  /**
   * Find a restaurant matching the given restaurantId
   * @param {string} restaurantId - The id of the restaurant to be found
   * @returns {Restaurant|null} - The instance of the found Restaurant. Returns null if no Restaurant was found
   */
  static async findById (restaurantId) {
    const restaurants = await Restaurant.find({
      _id: restaurantId
    })

    // No restaurant found with the given ID! Return null
    if (!restaurants[0]) {
      return null
    }

    return restaurants[0]
  }

  /**
   * Updates the restaurant passed as parameter, with the given restaurant data
   * @param {string} restaurantId - The ID of the restaurant to update
   * @param {*} data - The new restaurant data
   * @returns {Restaurant} - An instance of the new updated Restaurant
   */
  static async updateOne (restaurantId, data) {
    const restaurant = await RestaurantModel.findOneAndUpdate(
      {
        _id: restaurantId
      },
      {
        $set: data
      },
      {
        new: true
      }
    ).exec()

    return new Restaurant(restaurant)
  }

  /**
   * Deletes a restaurant from the DB, using the given ID
   * @param {string} restaurantId
   */
  static async deleteOne (restaurantId) {
    // TODO: Make all this more clear and simple. This is just a quick implementation
    try {
      await RestaurantModel.remove({
        _id: restaurantId
      })
      return true
    } catch (err) {
      winston.error(`There was an error when trying to remove a Restaurant by id: ${err.message}`, {
        _id: restaurantId,
        error: err
      })
      return false
    }
  }
}

