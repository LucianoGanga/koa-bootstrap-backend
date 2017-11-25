/* eslint-disable no-console */

const eslint = require('eslint')
const clc = require('cli-color')

const CLIEngine = eslint.CLIEngine

/**
 * Lint the staged files
 * @param {array} files Files to lint
 */
module.exports = async function runEslint (files) {
  let reports = []

  if (files && files.length) {
    console.log(clc.cyan(`> Linting files`))

    let errorCount = 0

    try {
      const cli = new CLIEngine()
      files.forEach((file) => {
        const report = cli.executeOnText(file.content, file.path)
        errorCount = errorCount + report.errorCount
        reports.push(report)
      })
    } catch (err) {
      throw err
    }

    if (reports && reports.length) {
      reports.forEach((report) => {
        showLintResults(report.results)
      })
      showLintErrorCount(errorCount)
    }

    if (errorCount) {
      process.exit(1)
    }
  }
}

/**
 * Show the lint report results.
 * Based on https://github.com/standard/snazzy/blob/master/index.js#L46
 * @param {array} Eslint report results
 */
const showLintResults = (results) => {
  var output = '\n'
  var total = 0

  results.forEach(function forEachResult (result) {
    var messages = result.messages

    if (messages.length === 0) {
      return
    }

    total += messages.length
    output += clc.underline(result.filePath) + '\n'

    messages.forEach((message) => {
      output += `  ${message.line || 0}:${message.column || 0} ${clc.red(
        'error'
      )} ${message.message.replace(/\.$/, '')} ${clc.blackBright(
        message.ruleId || ''
      )} \n`
    })
  })

  if (total > 0) {
    console.log(output)
  }
}

/**
 * Show the eslint error count
 * @param {number} errorCount
 */
const showLintErrorCount = (errorCount) => {
  let output = ''
  if (errorCount > 0) {
    const problems = errorCount > 1 ? ' problems' : ' problem'
    output = clc.red.bold(
      [ '\n', '\u2716 ', errorCount, problems, '\n' ].join('')
    )
  }
  if (output) {
    console.log(output)
  }
}
