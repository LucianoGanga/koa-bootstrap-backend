const { assert } = require('chai')

const restaurantController = require('controllers/restaurant')
const setupDb = require('workflow/scripts/setupDb')

describe('controller.restaurant.delete', function () {
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
      await restaurantController.delete(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'MISSING_PARAMETER')
    assert.notExists(context.body)
  })

  it('should delete the restaurant with ID "100000000000000000000000"', async function () {
    // First, check that the restaurant exists
    let context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      }
    })
    await restaurantController.list(context)
    assert.equal(context.body._id, '100000000000000000000000')

    // Then remove the restaurant
    context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      }
    })
    await restaurantController.delete(context)
    assert.equal(context.body, true)

    // Finally, check that the restaurant was successfully removed
    context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      }
    })
    await restaurantController.list(context)
    assert.equal(context.body, true)
    assert.equal(context.status, 404)
  })
})
