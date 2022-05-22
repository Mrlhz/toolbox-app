const clearAdsFiles = require('../core/clearAdsFiles')

function clearAction(program) {
  program.command('clear')
  .aliases(['c', 'remove'])
  .description('remove Ad files')
  .option('-d, --dirname <string>', '回收路径', './')
  .option('-r, --recycleBin <string>', '清理路径', './')
  .action((argv, c) => {
    const { dirname, recycleBin } = argv
    console.log({ dirname, recycleBin })
    clearAdsFiles({ dirname, recycleBin })
  })
}

module.exports = clearAction
