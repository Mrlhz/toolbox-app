const path = require('path')
const fs = require('fs-extra')
const { statSync } = fs

/**
 * @description 同步广度优先 + 先序遍历
 * BFS，其英文全称是Breadth First Search
 * @param {*} inputPath 
 * @returns 
 */
function deepTraverse(inputPath) {
  if (!fs.pathExistsSync(inputPath)) {
    return []
  }
  const stack = [inputPath]
  const result = []
  while(stack.length) {
    const file = stack.shift()

    if (statSync(file).isDirectory()) {
      // const childrens = fs.readdirSync(file).map(item => path.resolve(file, item))
      // stack.push(...childrens)
      const childs = fs.readdirSync(file)
      for (let i = 0, l = childs.length; i < l; i++) {
        stack.push(path.resolve(file, childs[i]))
      }
    } else {
      result.push(file)
    }
  }
  console.log(result.length)
  return result
}

/**
 * @description 同步深度优先 + 先序遍历
 * @param {*} inputPath 
 * @param {*} result 
 * @returns 
 */
function preOrderTraversal(inputPath, result = []) {
  if (!fs.pathExistsSync(inputPath)) {
    return []
  }

  const files = fs.readdirSync(inputPath)

  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i]
    const child = path.resolve(inputPath, file)
    if (fs.statSync(child).isDirectory()) {
      preOrderTraversal(child, result)
    } else {
      result.push(child)
    }
  }

  return result
}

/**
 * @description 同步深度优先 + 先序遍历
 * @param {*} inputPath 
 * @returns 
 */
function BFSTraverse(inputPath) {
  if (!fs.pathExistsSync(inputPath)) {
    return []
  }

  const result = []

  const traverse = (paths) => {
    const files = fs.readdirSync(paths)
    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i]
      const child = path.resolve(paths, file)
      if (statSync(child).isDirectory()) {
        traverse(child)
      } else {
        result.push(child)
      }
    }
  }

  traverse(inputPath)

  return result
}

module.exports = {
  deepTraverse,
  preOrderTraversal,
  BFSTraverse,
}
