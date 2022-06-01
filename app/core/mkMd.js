const fs = require('fs')
const path = require('path')

const { statSync, readdirSync } = fs

const folderIgnoreList = [
  '.git',
  '.idea',
  '.DS_Store',
  '.vscode',
  'node_modules'
]

const nodeSymbol = '|--'
const space = ' '.repeat(4)

class Folder {
  constructor(options) {
    const defaultOptions = {
      depth: '',
      parentFolder: '',
      path: '',
      name: '',
      folders: [],
      files: []
    }
    Object.assign(this, defaultOptions, options)
  }

  mkText() {
    const { name, files } = this
    const result = []
    result.push(`${this.getFolderSpace()}${nodeSymbol} ${name}`)

    files.forEach(file => {
      result.push(`${this.getFileSpace()}${nodeSymbol} ${path.basename(file)}`)
    })

    return result
  }

  getFolderSpace() {
    const { depth } = this
    if (depth === 0) return ''
    return space.repeat(depth)
  }

  getFileSpace() {
    const { depth } = this
    if (depth === 0) return space
    return '    |' + ' '.repeat(depth * 4 - 1)
  }
}

function getDepth(rootDepth = 0, folderPath = '') {
  return folderPath.split(path.sep).length - rootDepth
}

// https://github.com/JohnByrneRepo/mddir
function deepTraverse(inputPath = path.resolve('.')) {
  const rootDepth = inputPath.split(path.sep).length
  const folders = [inputPath]
  const foldersMap = {}
  while(folders.length) {
    const next = folders.shift()
    const isDirectory = statSync(next).isDirectory()
    const { dir, name } = path.parse(next)
    if (isDirectory && !folderIgnoreList.includes(name)) {
      const files = readdirSync(next).filter(file => !folderIgnoreList.includes(file)).map(file => path.resolve(next, file))
      const subFolders = files.filter(file => statSync(file).isDirectory())
      const folder = new Folder({
        depth: getDepth(rootDepth, next),
        parentFolder: dir,
        path: next,
        name,
        folders: subFolders,
        files: files.filter(file => statSync(file).isFile())
      })

      foldersMap[next] = folder

      folders.unshift(...subFolders)
    }
  }

  return foldersMap
}

function generateMarkdown(foldersMap = {}) {
  const keys = Object.keys(foldersMap || {})
  const result = []
  for (let i = 0, l = keys.length; i < l; i++) {
    const folder = foldersMap[keys[i]]
    result.push(...folder.mkText())
  }
  return result.join('\n')
}


console.log(process.cwd() === path.resolve('.'))

function main(inputPath) {
  console.time('Done in')
  const foldersMap = deepTraverse(inputPath)
  const text = generateMarkdown(foldersMap)
  fs.writeFileSync(path.resolve(__dirname, 'test.md'), text + '\n')
  console.timeEnd('Done in')
  console.log(foldersMap, foldersMap['D:\\web\\myblog\\toolbox-app'].mkText())
}

main(path.resolve(__dirname, '../../'))
