'use strict'

const mongoose = require('mongoose')

/**
 * Schema definition
 */
const Schema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'restaurant'
    },
    meals: [
      {
        mealId: {
          type: String
        },
        qty: {
          type: Number
        }
      }
    ],
    phone: {
      type: String
    },
    address: {
      type: String
    },
    location: {
      latitude: {
        type: String
      },
      longitude: {
        type: String
      }
    },
    totalCost: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  },
  {
    collection: 'orders',
    timestamps: true
  }
)

module.exports = mongoose.model('order', Schema)
