/* eslint-disable no-console prefer-promise-reject-errors */

const clc = require('cli-color')
const spawn = require('child_process').spawnSync

const runEslint = require('./scripts/runEslint')

const jsFileNamePattern = /\.jsx?$/i

/**
 * Get the git staged files
 */
const getStagedFiles = () => {
  return new Promise(function getStagedFilesPromise (resolve, reject) {
    let files = []

    const childFiles = spawn('git', [ 'diff', '--cached', '--name-only', '--diff-filter=ACMR' ], {
      stdio: [ 'ignore', 'pipe', process.stderr ]
    })

    if (childFiles.stdout) {
      files = childFiles.stdout
        .toString()
        .split('\n')
        .filter((filePath) => filePath)
        .filter((file) => jsFileNamePattern.test(file))
        .map((filePath) => {
          const childContent = spawn('git', [ 'show', `:0:${filePath}` ], {
            stdio: [ 'ignore', 'pipe', process.stderr ]
          })

          return {
            path: filePath,
            content: childContent.stdout ? childContent.stdout.toString() : ''
          }
        })
    }

    resolve(files)
  })
}

/**
 * Initialize all
 */
async function init () {
  try {
    const stagedFiles = await getStagedFiles()
    await runEslint(stagedFiles)
  } catch (err) {
    if (err) {
      console.log(clc.red(err))
    }
    process.exit(1)
  }
}

init()