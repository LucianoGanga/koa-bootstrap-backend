/* eslint-disable no-console  */
const clc = require('cli-color')
const setupTest = require('./scripts/setupTest')
const runMocha = require('./scripts/runMocha')

process.env.NODE_ENV = 'testing'
const TEST_PATH = process.env.TEST_PATH || 'test'

/**
 * Initialize all
 */
async function init () {
  try {
    const setup = await setupTest(TEST_PATH)
    await runMocha(setup.mocha)
  } catch (err) {
    if (err) {
      console.log(clc.red(err.message))
    }
    process.exit(1)
  }
}

init()
