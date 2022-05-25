const path = require('path')

const fs = require('fs-extra')
const { deepTraverse } = require('./deepTraverse')
const { isImage } = require('../../app/utils/index')

// Get the number of pictures
function getFileLength(pathLike) {
  const allFiles = deepTraverse(pathLike)
  console.log('allFiles length: ', allFiles.length)
  console.log('all image length: ', allFiles.filter(file => isImage(file)).length)
  console.log(allFiles.filter(file => !isImage(file)))
}

getFileLength('F:\\xx\\xx')
