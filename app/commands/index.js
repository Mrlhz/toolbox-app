const { Command } = require('commander')
const program = new Command()

const pkg = require('../../package.json')

const clearAction = require('./clear')
const flatAction = require('./flat')

function init() {
  program
    .name('toolbox-app')
    .description('A toolbox util app')
    .version(pkg.version, '-v, --version')


  clearAction(program)
  flatAction(program)

  program.parse()
}

module.exports = init
