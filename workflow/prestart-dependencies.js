'use strict'

const output = require('check-dependencies').sync({
  install: true
})

process.exit(output.status)
