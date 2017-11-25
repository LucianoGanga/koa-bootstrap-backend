const fs = require('fs')
const path = require('path')

/**
 * List all files in a directory in Node.js recursively in a synchronous fashion
 * @see https://gist.github.com/kethinov/6658166
 */
module.exports = function walkSync (dir, filelist, filterRegex) {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function forEachFile (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist, filterRegex)
    } else {
      filelist.push(path.join(dir, file))
    }
  })
  if (filterRegex && filterRegex instanceof RegExp) {
    filelist = filelist.filter((item) => {
      const file = path.basename(item)
      return !filterRegex.test(file)
    })
  }
  return filelist
}
