import { parseArgs } from 'node:util'
import { argv, exit } from 'node:process'
import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'

/**
 * @type {import('node:util').ParseArgsConfig['options']} options
 */
const options = {
  input: {
    type: 'string',
    short: 'i'
  },
  output: {
    type: 'string',
    short: 'o'
  }
}

/**
 * @param {Object} values
 * @param {string[]} requiredOptions
 * @returns {boolean}
 */
function requiredOptions (values, requiredOptions) {
  let isError = false
  requiredOptions.forEach(option => {
    if (values[option] === undefined) {
      console.log(`Missing required option --${option}`)
      isError = true
    }
  })

  return isError
}

/**
 *
 * @param {string[]} args
 */
async function run (args) {
  const { values } = parseArgs({
    options,
    args
  })

  if (requiredOptions(values, ['input', 'output'])) {
    exit(1)
  }

  await pipeline(createReadStream(values.input), createWriteStream(values.output))
}

run(argv.slice(2))
