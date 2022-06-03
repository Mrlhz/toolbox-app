const { traversalFileRename } = require('../core/rename')

function renameAction(program) {
  program.command('rename')
  .aliases(['r'])
  .description('重命名图片')
  .option('-d, --dirname <string>', '路径', './')
  .action((argv, c) => {
    const { dirname } = argv
    console.log({ dirname })
    traversalFileRename({ dirname })
  })
}

module.exports = renameAction
