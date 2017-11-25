const { assert } = require('chai')

const getStatus = require('controllers/status/check')

describe('controller - status.check', function () {
  let context

  before(async function () {})

  beforeEach(async function () {
    context = {
      body: null
    }
  })

  afterEach(async function () {})

  after(async function () {})

  it('should return "status: running"', async function () {
    getStatus(context)

    assert.exists(context.body)
    assert.equal(context.body.status, 'running')
  })
})
