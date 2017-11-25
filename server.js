'use strict'

// Allow require the files from the src folder
// It should be added to the very beginning of the main script
require('app-module-path').addPath('src')
const config = require('config')

const init = require('init')

// Initialize the app
async function start () {
  config.port = Number(process.env.PORT) || config.port
  await init(config)
}

start()
