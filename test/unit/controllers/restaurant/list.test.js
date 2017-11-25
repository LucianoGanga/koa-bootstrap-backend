const { assert } = require('chai')

const restaurantController = require('controllers/restaurant')
const setupDb = require('workflow/scripts/setupDb')

const restaurantsMock = require('test/mocks/restaurants')

describe('controller.restaurant.list', function () {
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

  it('should thrown an error if the param ratingMin is less than 1', async function () {
    const context = Object.assign(baseContext, {
      query: {
        ratingMin: 0
      },
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.list(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should thrown an error if the param ratingMin is more than 5', async function () {
    const context = Object.assign(baseContext, {
      query: {
        ratingMin: 6
      },
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.list(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })
  it('should thrown an error if the param ratingMax is less than 1', async function () {
    const context = Object.assign(baseContext, {
      query: {
        ratingMax: 0
      },
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.list(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should thrown an error if the param ratingMax is more than 5', async function () {
    const context = Object.assign(baseContext, {
      query: {
        ratingMax: 6
      },
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.list(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should thrown an error if the param ratingMax is less than ratingMin', async function () {
    const context = Object.assign(baseContext, {
      query: {
        ratingMin: 4,
        ratingMax: 2
      },
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.list(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'INVALID_ARGUMENT')
    assert.notExists(context.body)
  })

  it('should return an array of restaurants (with the same restaurants mocked for the tests) if controller worked ok', async function () {
    const context = Object.assign(baseContext, {
      query: {},
      request: {
        body: {}
      }
    })
    await restaurantController.list(context)

    assert.exists(baseContext.body)
    assert.deepEqual(baseContext.body, restaurantsMock)
  })

  it('should return the Restaurant with ID "100000000000000000000000"', async function () {
    const context = Object.assign(baseContext, {
      params: {
        restaurantId: '100000000000000000000000'
      },
      query: {},
      request: {
        body: {}
      }
    })
    await restaurantController.list(context)

    assert.exists(baseContext.body)
    assert.equal(baseContext.body._id, '100000000000000000000000')
  })
})
