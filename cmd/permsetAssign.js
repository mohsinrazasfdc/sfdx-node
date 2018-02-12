const yargsBuilder = require('../lib/yargsBuilder')

const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const shell = require('shelljs')

module.exports = {
  desc: 'Assign permission set to the scratch org user.',
  command: ['permsetassign [permsetname] [orgname] [alias|org|a]'],
  aliases: ['sdo'],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to assign permission set to'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to assign permission set to'
      })
      .example('$0 sdo PermSetName OrgAlias', "- Assigns 'PermSetName' to 'OrgAlias'")
  },

  handler: argv => {
    argv = yargsBuilder.handler(argv)
    const alias = argv.alias
    const permsetname = argv.permsetname

    let numResults = 0
    const results = []
    if (!permsetname) {
      const errorMessage = err('No permission set name provided.')
      results[numResults++] = {}
      results[numResults - 1].stderr = errorMessage
      if (!argv.quiet) console.error(errorMessage)
    } else {
      if (!argv.quiet) console.log("Assigning permission set " + permsetname + (alias ? "to '" + alias + "'" : 'default org') + "...")

      let permsetAssignCommand = 'sfdx force:user:permset:assign --permsetname ' + permsetname
      if (alias) permsetAssignCommand += ' --targetusername ' + alias

      results[numResults++] = shell.exec(permsetAssignCommand)
    }

    return getResults(results)
  }
}
