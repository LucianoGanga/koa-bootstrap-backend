const fs = require('fs')
const path = require('path')

const getTestFilesFromComments = require('./getTestFilesFromComments')

/**
 * Return a list of test files
 * @param {string} testPath The path to get the files. Could be a file or directory
 */
module.exports = (testPath) => {
  let testFiles = []

  // Check if is an array
  if (Array.isArray(testPath)) {
    testPath.forEach((path) => {
      testFiles = testFiles.concat(getFiles(path))
    })
  } else {
    testFiles = getFiles(testPath)
  }

  return testFiles
}

/**
 * Check and try to get the test files from a path
 * @param {string} testPath
 */
function getFiles (testPath) {
  let files = []

  const testPathStats = fs.lstatSync(testPath)

  // Check if is a file or directory
  if (testPathStats.isFile()) {
    // Check if the file exists
    if (fs.existsSync(testPath)) {
      // Check if is a test
      if (isTestFile(testPath)) {
        files.push(testPath)
      } else {
        // Check for files in @test comment
        const testFileContent = fs.readFileSync(testPath, 'utf8')
        files = getTestFilesFromComments(testFileContent)
      }
    } else {
      throw new Error(`The file ${testPath} doesn't exists`)
    }
  } else {
    const testFiles = walkSync(testPath).filter((file) => isTestFile(file))
    if (testFiles && testFiles.length) {
      files = testFiles
    } else {
      throw new Error(`There is no files to test in the directory ${testPath}`)
    }
  }

  return files
}

/**
 * List all files in a directory in Node.js recursively in a synchronous fashion
 * @see https://gist.github.com/kethinov/6658166
 */
function walkSync (dir, filelist) {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function forEachFile (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist)
    } else {
      filelist.push(path.join(dir, file))
    }
  })
  return filelist
}

/**
 * Check if the file is test
 * @param {string} file
 */
function isTestFile (file) {
  return file.substr(-8) === '.test.js'
}
