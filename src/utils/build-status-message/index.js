const prettyPrintQueueEntry = require('../pretty-print-queue-entry')

const buildStatusMessage = (originalQueue) => {
  const queue = [...originalQueue]
  const active = queue.shift()
  let msg = ''

  if (active) {
    msg = `:top: ${prettyPrintQueueEntry(active)}`
  }

  if (queue.length) {
    msg = `${msg}\n:soon: ${queue.map(prettyPrintQueueEntry).join(', ')}`
  }

  return msg
}

module.exports = buildStatusMessage
