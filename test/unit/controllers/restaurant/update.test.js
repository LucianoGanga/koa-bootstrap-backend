const { assert } = require('chai')

const restaurantController = require('controllers/restaurant')
const setupDb = require('workflow/scripts/setupDb')

describe('controller.restaurant.update', function () {
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
        body: {}
      }
    }
  })

  afterEach(async function () {})

  after(async function () {})

  it('should thrown an error if the param restaurantId is missing', async function () {
    const context = Object.assign(baseContext, {
      query: {},
      request: {
        body: {}
      }
    })
    let thrown
    try {
      await restaurantController.update(context)
    } catch (err) {
      thrown = err
    }

    assert.instanceOf(thrown, Error)
    assert.equal(thrown.code, 'MISSING_PARAMETER')
    assert.notExists(context.body)
  })

  it('should update the name of the restaurant with ID "100000000000000000000000" and return the modified restaurant', async function () {
    const context = Object.assign(baseContext, {
      query: {},
      params: {
        restaurantId: '100000000000000000000000'
      },
      request: {
        body: {
          data: {
            commercialName: 'La Mini',
            legalName: 'La mini Pizza Store'
          }
        }
      }
    })

    await restaurantController.update(context)

    assert.equal(context.body.commercialName, 'La Mini')
    assert.equal(context.body.legalName, 'La mini Pizza Store')
  })
})
