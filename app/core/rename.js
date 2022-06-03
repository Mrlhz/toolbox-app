const path = require('path')
const fs = require('fs-extra')
const { statSync, readdirSync } = fs
const { rename } = fs.promises

module.exports = {
  traversalFileRename
}

async function traversalFileRename({ dirname }) {
  const files = deepTraverse(dirname)
  const result = format(files)
  console.log(result, result.length)
  const tasks = result.map(({ oldPath, newPath }) => rename(oldPath, newPath))
  await Promise.allSettled(tasks)
}

function format(files = []) {
  return files
    .filter(file => {
      const { ext } = path.parse(file)
      return ['.jfif', '.webp'].includes(ext)
    })
    .map(file => {
    const { dir, name, ext, base } = path.parse(file)
    const newPath = path.resolve(dir, `${name.replace(/^;\s?/g, '')}.jpg`)
    return {
      oldPath: file,
      newPath
    }
  })
}

function deepTraverse(inputPath = path.resolve('.')) {
  const folders = [inputPath]
  const result = []
  while(folders.length) {
    const next = folders.shift()
    const isDirectory = statSync(next).isDirectory()
    if (isDirectory) {
      const files = readdirSync(next).map(file => path.resolve(next, file))
      folders.unshift(...files)
    } else {
      result.push(next)
    }
  }

  return result
}
