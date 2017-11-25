const { assert } = require('chai')

const orderController = require('controllers/order')
const OrderModel = require('models/order')
const setupDb = require('workflow/scripts/setupDb')

const ordersMock = require('test/mocks/orders')

describe('controller.order.place', function () {
  let baseContext

  before(async function () {
    await setupDb()
  })

  beforeEach(async function () {
    await setupDb()
    baseContext = {
      body: null,
      query: {},
      params: {},
      request: {
        body: null
      }
    }
  })

  afterEach(async function () {})

  after(async function () {})

  it('should thrown an error if the param restaurantId is missing', async function () {
    const context = Object.assign(baseContext, {})
    let thrown
    try {
      await orderController.place(context)
    } catch (err) {
      thrown = err
    }
    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'MISSING_PARAMETER')
    assert.include(thrown.missingParameters, 'restaurantId')
    assert.notExists(context.body)
  })

  it('should return status 404 if passed restaurantId does not exists', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: 'aaaaa0000000000000000000'
      },
      request: {
        body: {
          meals: [
            {
              mealId: '100000000000000000000001',
              qty: 2
            }
          ],
          address: '566 Vermont St, Brooklyn, NY 11207, USA',
          location: '[COORDINATES]'
        }
      }
    })
    await orderController.place(context)

    assert.equal(context.status, 404)
  })

  it('should create an order with the right totalCost and return ETA for the passed order', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      },
      request: {
        body: {
          phone: '+5492235332914',
          meals: [
            {
              mealId: '100000000000000000000001', // This item cost 7.99
              qty: 2
            }
          ],
          address: '566 Vermont St, Brooklyn, NY 11207, USA',
          location: {
            latitude: '40.6655101',
            longitude: '-73.89188969999998'
          }
        }
      }
    })
    await orderController.place(context)

    // Check that the posted order is created in the DB
    const orders = JSON.parse(JSON.stringify(await OrderModel.find({}).lean().exec()))
    assert.equal(ordersMock[0].restaurant, '100000000000000000000000')
    assert.equal(ordersMock[0].meals[0].mealId, orders[0].meals[0].mealId)
    assert.equal(ordersMock[0].meals[0].qty, orders[0].meals[0].qty)

    // Make sure the totalCost is right
    assert.equal(orders[0].totalCost, 15.98)

    // Check if the ETA exists as a String (if it's null, it's because it couldn't be calculated)
    console.log('ETA: ', context.body)
    assert.isString(context.body)
  })
})
