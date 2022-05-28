const path = require('path')

const fs = require('fs-extra')
const sharp = require('sharp')

async function zipOne({ input, fileOut, format = 'jpeg', options = { mozjpeg: true } }) {
  const image = sharp(input)
  const metadata = await image.metadata()
  const { width, height } = metadata

  return image
    .resize(Math.round(width / 2))
    .toFormat(format, options)
    .toFile(fileOut)
    .catch(e => {
      // return { status: 'rejected', error: e } // todo
      return Promise.reject(e.message)
    })
}

function getNewName(file) {
  const { dir, name } = path.parse(file)
  console.log(path.parse(file))
  return path.join(dir, `${name}.zip.jpeg`)
}

module.exports = {
  zipOne
}

// test
// zipOne({
//   input: 'F:\\森罗财团\\X\\X-050\\146.jpg',
//   fileOut: getNewName('F:\\森罗财团\\X\\X-050\\146.jpg'),
// })
