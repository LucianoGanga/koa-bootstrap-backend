const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const morgan = require('koa-morgan')
const { stripIndent } = require('common-tags')
const db = require('db')

const errorHandler = require('errors/errorHandler')
const diagnostics = require('diagnostics/init')
const routers = require('routers')

const config = require('config')

module.exports = async function init({ appName, environment, port }) {
  const app = new Koa()

  // Init diagnostics
  diagnostics.init(config)

  // Connect to the database
  await db.init(config.MONGO)

  // Error handler
  app.use(errorHandler)

  // Add morgan to log requests
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

  app.use(bodyParser())

  // Load Routes
  for (let r in routers) {
    app.use(routers[r].routes()).use(routers[r].allowedMethods())
  }

  const server = app.listen(port)

  // eslint-disable-next-line no-console
  console.log(stripIndent`\n
    =================================
    🎧  Koa server is listening...
    App  : ${appName}
    Port : ${port}
    Env  : ${environment}
    =================================
    `)
}
