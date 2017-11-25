// Allow require the files from the src folder
// It should be added to the very beginning of the main script
require('app-module-path').addPath('.')
require('app-module-path').addPath('src')
require('app-module-path').addPath('test')

const sqs = require('sqs')
const Mocha = require('mocha')
const config = require('config')

const getTestFiles = require('./getTestFiles')

const mocha = new Mocha({
  timeout: 12000
})

module.exports = async function setup (testPath) {
  // Initialize SQS
  await sqs.init()

  // Setup Mocha
  const mocha = await setupMocha(testPath)

  return {
    config,
    mocha
  }
}

/**
 * Setup mocha
 */
async function setupMocha (testPath) {
  const testFiles = getTestFiles(testPath)

  if (testFiles && testFiles.length) {
    testFiles.forEach(function forEachFile (file) {
      mocha.addFile(file)
    })
  } else {
    return null
  }

  return mocha
}
