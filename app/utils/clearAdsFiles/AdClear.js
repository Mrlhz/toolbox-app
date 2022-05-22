
async function AdClear (adFiles = []) {
  const list = adFiles.map(item => remove(item))
  await Promise.allSettled(list)
}

module.exports = AdClear
