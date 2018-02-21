const formatAsCode = require('../format-as-code')

const prettyPrintQueueEntry = ({ branch, user }) => {
  return formatAsCode(`${branch} (${user.name})`)
}

module.exports = prettyPrintQueueEntry
