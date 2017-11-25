/* eslint-disable no-console  no-useless-escape */
const clc = require('cli-color')
const getFileList = require('./scripts/getFileList')
const getTestFilesFromComments = require('./scripts/getTestFilesFromComments')
const fs = require('fs')

const PATHS = process.env.PATHS || 'src'

/**
 * Initialize all
 */
async function init () {
  try {
    const filter = /^_|(^|\/)\.[^\/\.]|index.js|\.json/g

    PATHS.split(',').forEach(async (path) => {
      console.log(clc.green(`\n> Analyzing ${path}... \n`))
      const files = getFileList(path, [], filter)

      showFilesTestResume(files)
    })
  } catch (err) {
    if (err) {
      console.log(clc.red(err.message))
    }
    process.exit(1)
  }
}

/**
 * Show the resume for test files
 * @param {array} files
 */
function showFilesTestResume (files) {
  const filesContent = files.map((file) => {
    return {
      file,
      content: fs.readFileSync(file, 'utf8')
    }
  })
  const filesWithoutTest = filesContent
    .filter((fileContent) => {
      const testFiles = getTestFilesFromComments(fileContent.content)
      return !testFiles.length
    })
    .map((fileContent) => fileContent.file)

  console.log(clc.red(`- Files without tests: ${filesWithoutTest.length}\n`))
  if (filesWithoutTest && filesWithoutTest.length) {
    filesWithoutTest.forEach((file) => {
      console.log(clc.blackBright(`${file}`))
    })
  }
}

init()
