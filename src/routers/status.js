'use strict'

const Router = require('koa-router')
const router = new Router()

const statusController = require('diagnostics/statusController')
router.get('/status', statusController)

module.exports = router
