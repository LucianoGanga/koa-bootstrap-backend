const { assert } = require('chai')

const restaurantController = require('controllers/restaurant')
const setupDb = require('workflow/scripts/setupDb')

describe('controller.restaurant.rate', function () {
  let baseContext

  before(async function () {
    await setupDb()
  })

  beforeEach(async function () {
    await setupDb()
    baseContext = {
      body: null,
      params: {},
      query: {},
      request: {
        body: {
          name: 'Anna',
          review: "Nice place! Fun flavours! I'd recommend it",
          rating: 4
        }
      }
    }
  })

  afterEach(async function () {})

  after(async function () {})

  it('should thrown an error if the param restaurantId is missing', async function () {
    const context = Object.assign(baseContext, {
      query: {},
      request: {
        body: {
          name: 'Anna',
          review: "Nice place! Fun flavours! I'd recommend it",
          rating: 4
        }
      }
    })
    let thrown
    try {
      await restaurantController.rate(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'MISSING_PARAMETER')
    assert.notExists(context.body)
  })

  it('should thrown an error if the param rating is less than 1', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      },
      request: {
        body: {
          name: 'Mark',
          review: 'Not a good place!',
          rating: 0
        }
      }
    })
    let thrown
    try {
      await restaurantController.rate(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should thrown an error if the param rating is more than 5', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      },
      request: {
        body: {
          name: 'Anna',
          review: "Nice place! Fun flavours! I'd recommend it",
          rating: 6
        }
      }
    })
    let thrown
    try {
      await restaurantController.rate(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should rate the Restaurant "100000000000000000000000"', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      },
      request: {
        body: {
          name: 'Anna',
          review: 'Did not like it.',
          rating: 1
        }
      }
    })

    await restaurantController.rate(context)

    assert.equal(context.body, 3.3)
  })
})
