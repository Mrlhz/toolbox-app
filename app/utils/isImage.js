/**
 * @see https://github.com/arthurvr/image-extensions
 * @see https://github.com/sindresorhus/file-type
 */
const imageExtensions = ['gif', 'png', 'jpg', 'jpeg', 'webp', 'grf', 'ico', 'jng', 'jfif', 'jp2', 'jps', 'mng', 'svg', 'jpe']

// https://github.com/buxlabs/is-image/blob/master/index.js
// https://github.com/stdlib-js/utils-extname
// https://github.com/kevva/ext-name
function extname(file = '') {
  if (file.indexOf('.') === -1) return ''
  return file.split('.').pop()
}

function isImage(file) {
  if (!file) return false
  return imageExtensions.includes(extname(file).toLocaleLowerCase())
}

module.exports = {
  isImage,
  extname
}
