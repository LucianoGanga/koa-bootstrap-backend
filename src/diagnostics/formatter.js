const _ = require('lodash')
const toYAML = require('winston-console-formatter')

module.exports = {
  console (config, colors) {
    const defaultConfig = {
      timestamp: () => '',
      excludeKeys: []
    }

    const formatterOptions = _.defaults(config, defaultConfig)
    const loggerConfiguration = toYAML.config(formatterOptions, {
      colors: colors
    })
    const yamlFormatter = loggerConfiguration.formatter

    loggerConfiguration.formatter = (options) => {
      if (typeof options.meta === 'object' && options.meta !== null) {
        options.meta = _.omit(options.meta, loggerConfiguration.excludeKeys)
      }
      return yamlFormatter(options)
    }

    return loggerConfiguration
  }
}
