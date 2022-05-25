const path = require('path')
const fs = require('fs-extra')
const { statSync } = fs

function deepTraverse(inputPath) {
  if (!fs.pathExistsSync(inputPath)) {
    console.log(inputPath)
    return []
  }
  const stack = fs.readdirSync(inputPath).map(item => path.resolve(inputPath, item))
  const result = []
  while(stack.length) {
    const file = stack.shift()

    if (statSync(file).isDirectory()) {
      const childrens = fs.readdirSync(file).map(item => path.resolve(file, item))
      stack.push(...childrens)
    } else {
      result.push(file)
    }
  }
  console.log(result.length)
  return result
}

module.exports = {
  deepTraverse
}


function _deepTraverse(inputPath, result = []) {
  if (!fs.pathExistsSync(inputPath)) {
    console.log(inputPath)
    return []
  }

  const files = fs.readdirSync(inputPath)

  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i]
    const child = path.resolve(inputPath, file)
    if (fs.statSync(child).isDirectory()) {
      _deepTraverse(child, result)
    } else {
      result.push(child)
    }
  }

  return result
}

console.time('Done in ')
let r = deepTraverse('F:\\喵糖映画\\婚纱', [])
console.timeEnd('Done in ')
console.log(r.length, r[100])
