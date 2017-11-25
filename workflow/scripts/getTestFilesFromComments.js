/* eslint-disable no-console */

const fs = require('fs')
const doctrine = require('doctrine')
const clc = require('cli-color')

const commentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm

/**
 * Parse the comments of a file and return a list of test files from the @test tag
 * @param {string} fileContent The content of the file to parse
 */
module.exports = (fileContent) => {
  let files = []
  let matches = []

  // If there is content
  if (fileContent) {
    let match = commentsRegex.exec(fileContent)
    while (match != null) {
      matches.push(match[0])
      match = commentsRegex.exec(fileContent)
    }
  }

  // If there are matches
  if (matches && matches.length) {
    matches.forEach((match) => {
      // Parse comments
      const ast = doctrine.parse(match, { unwrap: true })
      const tags = ast.tags

      // Get the test file from the @test comment
      if (tags && tags.length) {
        const testTags = tags.find((tag) => tag.title === 'test')
        if (testTags) {
          const file = testTags.description

          if (fs.existsSync(file)) {
            files.push(file)
          } else {
            console.log(clc.red(`The test file '${file}' doesn't exists!`))
          }
        }
      }
    })
  }

  return files
}
