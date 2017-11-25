/* eslint-disable no-console */

const clc = require('cli-color')

/**
 * Run the test with mocha
 * @param {object} mocha An instance of mocha
 */
module.exports = async function runMocha (mocha) {
  if (mocha) {
    console.log(clc.cyan(`> Running tests`))

    let failures
    const runner = mocha.run((fail) => {
      failures = fail
    })

    runner.on('end', () => process.exit(failures))
  } else {
    process.exit()
  }
}
