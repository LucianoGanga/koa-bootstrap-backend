'use strict'

const mongoose = require('mongoose')

/**
 * Schema definition
 */
const Schema = new mongoose.Schema(
  {
    logo: {
      type: String
    },
    commercialName: {
      type: String
    },
    legalName: {
      type: String
    },
    rating: {
      type: Number
    },
    reviews: [
      {
        name: {
          type: String
        },
        review: {
          type: String
        },
        rating: {
          type: Number
        }
      }
    ],
    meals: [
      {
        name: {
          type: String
        },
        description: {
          type: String
        },
        price: {
          type: Number
        }
      }
    ],
    commercialEmail: {
      type: String
    },
    adminNumber: {
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
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  },
  {
    collection: 'restaurants',
    timestamps: true
  }
)

module.exports = mongoose.model('restaurant', Schema)
